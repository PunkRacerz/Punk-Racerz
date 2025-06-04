import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import PowerUpEffect from '@/components/powerups';



export default function PlayerKart({ sampledPoints, registerOrbs, setSpeed, glbPath, racerId = 'spark', orbCount = 0 }) {
  const kartRef = useRef();
  const keys = useRef({});

  const yawRef = useRef(0);
  const isBoosting = useRef(false);
  const boostTime = useRef(0);
  const isJumping = useRef(false);
  const specialUsed = useRef(false);

  const fallTimer = useRef(0);
  const [falling, setFalling] = useState(false);
  const lastCheckpoint = useRef(new THREE.Vector3(0, 2, 0));

  const checkpoints = useMemo(() => {
    return sampledPoints?.filter((_, i) => i % 10 === 0).map((pt) => new THREE.Vector3(pt.x, pt.y + 1, pt.z)) || [];
  }, [sampledPoints]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.location.pathname !== '/race-simulator') return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      if (window.location.pathname !== '/race-simulator') return;
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === ' ') isJumping.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const impulse = useMemo(() => new THREE.Vector3(), []);

  const { scene } = useGLTF(glbPath);
  console.log('🔍 GLTF loaded:', scene, 'from', glbPath);
  
  const clonedModel = useMemo(() => {
    if (!scene || typeof scene.clone !== 'function') return null;
  
    const model = scene.clone();
    model.rotation.y = Math.PI; // Common flip to face forward
  
    // 🔄 Apply 90° X-axis rotation to fix GlitchFang and Eclipse.9
    if (['glitchfang', 'eclipse9'].includes(racerId.toLowerCase())) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.rotation.x = -Math.PI / 2;
        }
      });
    }
  
    return model;
  }, [scene, racerId]);
  
  

  if (!glbPath || !clonedModel) return null;

  const handleInput = (delta, rigidBody) => {
    const steerSpeed = 2.5;
    if (keys.current['a']) yawRef.current += steerSpeed * delta;
    if (keys.current['d']) yawRef.current -= steerSpeed * delta;

    euler.set(0, yawRef.current, 0);
    quat.setFromEuler(euler);
    rigidBody.setRotation(quat, true);

    const steerAmount = keys.current['a'] ? 1 : keys.current['d'] ? -1 : 0;
    if (steerAmount !== 0) {
      right.set(1, 0, 0).applyQuaternion(quat);
      rigidBody.applyImpulse(right.multiplyScalar(steerAmount * 0.2 * delta), true);
    }

    impulse.set(0, 0, 0);
    if (keys.current['w']) {
      forward.set(0, 0, -1).applyQuaternion(quat);
      impulse.copy(forward).multiplyScalar(80 * delta);
    }
    if (keys.current['s']) {
      forward.set(0, 0, 1).applyQuaternion(quat);
      impulse.copy(forward).multiplyScalar(20 * delta);
    }
    rigidBody.applyImpulse(impulse, true);

    if (keys.current[' '] && !isJumping.current) {
      isJumping.current = true;
      rigidBody.applyImpulse({ x: 0, y: 10, z: 0 }, true);
    }

    if (keys.current['b'] && !isBoosting.current) {
      isBoosting.current = true;
      boostTime.current = 2;
      forward.set(0, 0, -1).applyQuaternion(quat);
      rigidBody.applyImpulse(forward.clone().multiplyScalar(90), true);
    }

    if (isBoosting.current) {
      boostTime.current -= delta;
      if (boostTime.current <= 0) isBoosting.current = false;
    }

    if (keys.current['n'] && !specialUsed.current) {
      specialUsed.current = true;
      console.log("Special move activated!");
    }
  };

  useFrame((state, delta) => {
    const rigidBody = kartRef.current;
    if (!rigidBody || !state.camera) return;

    const velocity = rigidBody.linvel();
    const speed = velocity ? Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) : 0;
    setSpeed?.(speed);

    const pos = rigidBody.translation();
    const rot = rigidBody.rotation();
    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const currentQuat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

    if (currentPos.y < -5 && !falling) {
      setFalling(true);
      fallTimer.current = 1;
    }

    if (falling) {
      fallTimer.current -= delta;
      if (fallTimer.current <= 0) {
        const closest = checkpoints.reduce((nearest, point) => {
          const dist = currentPos.distanceTo(point);
          return dist < currentPos.distanceTo(nearest) ? point : nearest;
        }, checkpoints[0] || new THREE.Vector3(0, 2, 0));

        rigidBody.setTranslation(closest, true);
        rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        yawRef.current = 0;
        setFalling(false);
      }
      return;
    }

    for (let i = 0; i < checkpoints.length; i++) {
      if (currentPos.distanceTo(checkpoints[i]) < 3) {
        lastCheckpoint.current = checkpoints[i];
        break;
      }
    }

    handleInput(delta, rigidBody);

    const angVel = rigidBody.angvel();
    rigidBody.setAngvel({
      x: THREE.MathUtils.clamp(angVel.x, -1.5, 1.5),
      y: angVel.y,
      z: THREE.MathUtils.clamp(angVel.z, -1.5, 1.5),
    }, true);

    const camEuler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');
    const yawOnlyQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, camEuler.y, 0));
    const camOffset = new THREE.Vector3(0, 4, 10).applyQuaternion(yawOnlyQuat);
    desiredCamPos.copy(currentPos).add(camOffset);
    state.camera.position.lerp(desiredCamPos, 5 * delta);
    state.camera.lookAt(currentPos);
  });

  return (
    <RigidBody
      name="playerKart"
      ref={kartRef}
      type="dynamic"
      position={[0, 4, 0]}
      linearDamping={0.65}
      angularDamping={1.0}
    >
      <CapsuleCollider args={[0.25, 0.75]} />
  
      {/* 🔄 Apply visual correction only to GlitchFang and Eclipse.9 */}
      <group
        rotation={
          ['glitchfang', 'eclipse9'].includes(racerId.toLowerCase())
            ? [-Math.PI / 2, Math.PI / 2, 2]
            : [0, Math.PI, 0]
        }
      >
        <primitive object={clonedModel} scale={2} />
      </group>
  
      <PowerUpEffect racerId={racerId} orbCount={orbCount} meshRef={kartRef} />
    </RigidBody>
  );  
}

useGLTF.preload('/karts/spark-kart.glb');
useGLTF.preload('/karts/glitchfang-kart.glb');
useGLTF.preload('/karts/nova13-kart.glb');
useGLTF.preload('/karts/venoma-kart.glb');
useGLTF.preload('/karts/blizzardexe-kart.glb');
useGLTF.preload('/karts/scrapdrift-kart.glb');
useGLTF.preload('/karts/eclipse9-kart.glb');
useGLTF.preload('/karts/aetherx-kart.glb');
useGLTF.preload('/karts/zosi-kart.glb');
useGLTF.preload('/karts/razorbyte-kart.glb');
useGLTF.preload('/karts/ignisvyre-kart.glb');
useGLTF.preload('/karts/solstice-kart.glb');

