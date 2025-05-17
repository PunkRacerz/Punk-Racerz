import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';



export default function PlayerKart({ sampledPoints, registerOrbs, setSpeed }) {

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
    const velocity = kartRef.current?.linvel();
    const speed = velocity ? Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) : 0;
    setSpeed?.(speed);
    const rigidBody = kartRef.current;
    const camera = state.camera;
    if (!rigidBody || !camera) return;

    const pos = rigidBody.translation();
    const rot = rigidBody.rotation();

    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const currentQuat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

    if (meshRef.current && sampledPoints?.length > 2) {
      const closestIndex = sampledPoints.reduce((closestIdx, pt, idx) => {
        const dist = currentPos.distanceToSquared(new THREE.Vector3(pt.x, pt.y, pt.z));
        const closestDist = currentPos.distanceToSquared(new THREE.Vector3(sampledPoints[closestIdx].x, sampledPoints[closestIdx].y, sampledPoints[closestIdx].z));
        return dist < closestDist ? idx : closestIdx;
      }, 0);

      const behind = sampledPoints[Math.max(closestIndex - 1, 0)];
      const ahead = sampledPoints[Math.min(closestIndex + 1, sampledPoints.length - 1)];

      const slopeVec = new THREE.Vector3().subVectors(
        new THREE.Vector3(ahead.x, ahead.y, ahead.z),
        new THREE.Vector3(behind.x, behind.y, behind.z)
      ).normalize();

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(up, slopeVec).normalize();
      const newUp = new THREE.Vector3().crossVectors(slopeVec, right).normalize();

      const mat4 = new THREE.Matrix4().makeBasis(right, newUp, slopeVec);
      const slopeQuat = new THREE.Quaternion().setFromRotationMatrix(mat4);

      meshRef.current.quaternion.slerp(slopeQuat, 10 * delta);
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

    // Clamp angular velocity to reduce spin jitter
    const angVel = rigidBody.angvel();
    rigidBody.setAngvel({
      x: THREE.MathUtils.clamp(angVel.x, -1.5, 1.5),
      y: angVel.y,
      z: THREE.MathUtils.clamp(angVel.z, -1.5, 1.5),
    }, true);

    // Apply slopeQuat to rigidBody if available
    if (sampledPoints?.length > 2) {
      const closestIndex = sampledPoints.reduce((closestIdx, pt, idx) => {
        const dist = currentPos.distanceToSquared(new THREE.Vector3(pt.x, pt.y, pt.z));
        const closestDist = currentPos.distanceToSquared(new THREE.Vector3(sampledPoints[closestIdx].x, sampledPoints[closestIdx].y, sampledPoints[closestIdx].z));
        return dist < closestDist ? idx : closestIdx;
      }, 0);

      const behind = sampledPoints[Math.max(closestIndex - 1, 0)];
      const ahead = sampledPoints[Math.min(closestIndex + 1, sampledPoints.length - 1)];

      const slopeVec = new THREE.Vector3().subVectors(
        new THREE.Vector3(ahead.x, ahead.y, ahead.z),
        new THREE.Vector3(behind.x, behind.y, behind.z)
      ).normalize();

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(up, slopeVec).normalize();
      const newUp = new THREE.Vector3().crossVectors(slopeVec, right).normalize();

      const mat4 = new THREE.Matrix4().makeBasis(right, newUp, slopeVec);
      const slopeQuat = new THREE.Quaternion().setFromRotationMatrix(mat4);

      // rigidBody.setRotation(slopeQuat, true); // Disabled to avoid physics conflicts
    }

    const camEuler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');
    const yawOnlyQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, camEuler.y, 0));

    // Offset behind the kart using yaw-only quaternion
    const camOffset = new THREE.Vector3(0, 4, 10).applyQuaternion(yawOnlyQuat);
    desiredCamPos.copy(currentPos).add(camOffset);

    // Smoothly follow position
    camera.position.lerp(desiredCamPos, 5 * delta);

    // Always look at the kart
    camera.lookAt(currentPos);
  });

  return (
    <RigidBody
      ref={kartRef}
      type="dynamic"
      position={[0, 4, 0]}
      linearDamping={0.4}
      angularDamping={0.9}
    >
      <CapsuleCollider args={[0.25, 0.75]} />
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
}





