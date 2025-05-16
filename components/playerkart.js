import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

export default function PlayerKart({ sampledPoints }) {
  const kartRef = useRef();
  const meshRef = useRef();
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
    return sampledPoints
      ?.filter((_, i) => i % 10 === 0)
      .map((pt) => new THREE.Vector3(pt.x, pt.y + 1, pt.z)) || [];
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

  const handleInput = (delta, rigidBody) => {
    const currentQuat = rigidBody.rotation();

    // Apply yaw rotation directly
    const steerSpeed = 2.5; // radians/sec
    if (keys.current['a']) yawRef.current += steerSpeed * delta;
    if (keys.current['d']) yawRef.current -= steerSpeed * delta;

    euler.set(0, yawRef.current, 0);
    quat.setFromEuler(euler);
    rigidBody.setRotation(quat, true);

    // Optional: slight side nudge to simulate lean
    const steerAmount = keys.current['a'] ? 1 : keys.current['d'] ? -1 : 0;
    if (steerAmount !== 0) {
      right.set(1, 0, 0).applyQuaternion(quat);
      rigidBody.applyImpulse(right.multiplyScalar(steerAmount * 0.2 * delta), true);
    }

    // Update forward impulse
    impulse.set(0, 0, 0);
    if (keys.current['w']) {
      forward.set(0, 0, -1).applyQuaternion(quat);
      impulse.copy(forward).multiplyScalar(35 * delta);
    }
    if (keys.current['s']) {
      forward.set(0, 0, 1).applyQuaternion(quat);
      impulse.copy(forward).multiplyScalar(25 * delta);
    }
    rigidBody.applyImpulse(impulse, true);

    // Jump
    if (keys.current[' '] && !isJumping.current) {
      isJumping.current = true;
      rigidBody.applyImpulse({ x: 0, y: 10, z: 0 }, true);
    }

    // Boost
    if (keys.current['b'] && !isBoosting.current) {
      isBoosting.current = true;
      boostTime.current = 2;
      forward.set(0, 0, -1).applyQuaternion(quat);
      rigidBody.applyImpulse(forward.clone().multiplyScalar(60), true);
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
    const camera = state.camera;
    if (!rigidBody || !camera) return;

    const pos = rigidBody.translation();
    const rot = rigidBody.rotation();

    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const currentQuat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

    if (meshRef.current) {
      const visualEuler = new THREE.Euler().setFromQuaternion(currentQuat);
      meshRef.current.rotation.copy(visualEuler);
    }

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

    forward.set(0, 0, -1).applyQuaternion(currentQuat);
    const camOffset = forward.clone().multiplyScalar(-7).setY(4);
    desiredCamPos.copy(currentPos).add(camOffset);

    camera.position.lerp(desiredCamPos, 3 * delta);
    camera.lookAt(currentPos);
  });

  return (
    <RigidBody
      ref={kartRef}
      type="dynamic"
      colliders="cuboid"
      position={[0, 2, 0]}
      linearDamping={0.4}
      angularDamping={0.9}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
}




