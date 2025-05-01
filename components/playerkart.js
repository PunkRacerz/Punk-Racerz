import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, useRapier } from '@react-three/rapier';


export default function PlayerKart({ registerOrbs, sampledPoints }) {
  const kartRef = useRef();
  const speed = useRef(0);
  const rotation = useRef(0);
  const driftBoost = useRef(0);
  const keys = useRef({});
  const [shake, setShake] = useState(false);
  const shakeTime = useRef(0);
  const isBoosting = useRef(false);
  const boostTime = useRef(0);
  const isJumping = useRef(false);
  const specialUsed = useRef(false);
  const orbRefs = useRef([]);

  const { rapier, world } = useRapier();

  useEffect(() => {
    const receiveOrbRefs = (refs) => {
      orbRefs.current = refs;
    };
    if (typeof registerOrbs === 'function') {
      registerOrbs(receiveOrbRefs);
    }
  }, [registerOrbs]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.location.pathname !== '/race-simulator') return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      if (window.location.pathname !== '/race-simulator') return;
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const progress = useRef(0);

  useFrame((state, delta) => {
    const rigidBody = kartRef.current;
    const camera = state.camera;
    if (!rigidBody || !camera) return;
  
    // Control movement
    if (keys.current['w']) speed.current = Math.min(speed.current + 15 * delta, 20);
    else if (keys.current['s']) speed.current = Math.max(speed.current - 15 * delta, -5);
    else speed.current = Math.max(speed.current - 8 * delta, 0);
  
    if (keys.current['a']) rotation.current += 2.5 * delta;
    if (keys.current['d']) rotation.current -= 2.5 * delta;
  
    // Boost
    if (keys.current['b'] && !isBoosting.current) {
      isBoosting.current = true;
      boostTime.current = 2;
      speed.current = Math.min(speed.current + 10, 30);
    }
    if (isBoosting.current) {
      boostTime.current -= delta;
      if (boostTime.current <= 0) isBoosting.current = false;
    }
  
    // Jump
    if (keys.current[' '] && !isJumping.current) {
      isJumping.current = true;
    }
  
    // Special ability
    if (keys.current['n'] && !specialUsed.current) {
      specialUsed.current = true;
      console.log("Special move activated!");
    }
  
    // Calculate movement
    const forward = new THREE.Vector3(Math.sin(rotation.current), 0, Math.cos(rotation.current));
    const moveDelta = forward.clone().multiplyScalar(speed.current * delta);
    const currentPos = rigidBody.translation();
  
    const nextPos = {
      x: currentPos.x + moveDelta.x,
      y: currentPos.y,
      z: currentPos.z + moveDelta.z,
    };
  
    // ✅ Raycast hover + tilt (no sampledPoints check)
    if (world) {
      const rayStart = new THREE.Vector3(currentPos.x, currentPos.y + 1, currentPos.z);
      const rayDir = new THREE.Vector3(0, -1, 0);
  
      const rayHit = world.castRay({ origin: rayStart, dir: rayDir }, 2, true);
  
      if (rayHit && rayHit.toi !== undefined) {
        const surfaceNormal = new THREE.Vector3(rayHit.normal.x, rayHit.normal.y, rayHit.normal.z).normalize();
        const targetY = rayStart.y - rayHit.toi + 0.3; // hover height above surface
        nextPos.y = THREE.MathUtils.lerp(currentPos.y, targetY, 0.2); // smooth height transition
  
        const up = new THREE.Vector3(0, 1, 0);
        const tiltQuat = new THREE.Quaternion().setFromUnitVectors(up, surfaceNormal);
        const facingQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotation.current, 0));
        const combinedQuat = facingQuat.clone().multiply(tiltQuat);
        rigidBody.setNextKinematicRotation(combinedQuat);
      }
    }
  
    // Apply position
    rigidBody.setNextKinematicTranslation(nextPos);
  
    // ORB collection
    orbRefs.current.forEach((orb, i) => {
      if (!orb || !orb.position) return;
      const dist = new THREE.Vector3(nextPos.x, nextPos.y, nextPos.z).distanceTo(orb.position);
      if (dist < 1.5) {
        orb.visible = false;
        if (orb.material?.color?.set) orb.material.color.set('red');
        setTimeout(() => {
          orb.visible = true;
          if (orb.material?.color?.set) orb.material.color.set('cyan');
        }, 5000);
      }
    });
  
    if (driftBoost.current > 0) {
      driftBoost.current -= delta;
      if (driftBoost.current <= 0) driftBoost.current = 0;
    }
  
    // Update camera (no OrbitControls anymore)
    const camOffset = forward.clone().multiplyScalar(-7); // further back
    camOffset.y += 4; // higher view
    const desiredCamPos = new THREE.Vector3(
      nextPos.x + camOffset.x,
      nextPos.y + camOffset.y,
      nextPos.z + camOffset.z
    );
  
    if (shake && shakeTime.current > 0) {
      desiredCamPos.x += (Math.random() - 0.5) * 0.2;
      desiredCamPos.y += (Math.random() - 0.5) * 0.2;
      desiredCamPos.z += (Math.random() - 0.5) * 0.2;
      shakeTime.current -= delta;
    } else {
      setShake(false);
    }
  
    camera.position.lerp(desiredCamPos, 3 * delta);
    camera.lookAt(new THREE.Vector3(nextPos.x, nextPos.y, nextPos.z));
  });

  return (
    <RigidBody
      ref={kartRef}
      type="kinematicPosition"
      colliders="cuboid"
      position={[0, 1, 0]}
      linearDamping={1}
      angularDamping={1}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
}