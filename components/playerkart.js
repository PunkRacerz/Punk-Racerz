import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const barrierBoxes = []; // Optional: import from global if shared

export default function playerkart() {
  const kartRef = useRef();
  const speed = useRef(0);
  const rotation = useRef(0);
  const driftBoost = useRef(0);
  const keys = useRef({});
  const orbitControlsRef = useRef();
  const [shake, setShake] = useState(false);
  const shakeTime = useRef(0);
  const isBoosting = useRef(false);
  const boostTime = useRef(0);
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);
  const specialUsed = useRef(false);

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

  useFrame((state, delta) => {
    const kart = kartRef.current;
    const camera = state.camera;

    if (!kart || !kart.position || !camera) return;

    if (keys.current['w']) speed.current = Math.min(speed.current + 15 * delta, 20);
    else if (keys.current['s']) speed.current = Math.max(speed.current - 15 * delta, -5);
    else speed.current = Math.max(speed.current - 8 * delta, 0);

    let turning = false;
    if (keys.current['a']) {
      rotation.current += 2.5 * delta;
      turning = true;
    }
    if (keys.current['d']) {
      rotation.current -= 2.5 * delta;
      turning = true;
    }

    if (turning && Math.abs(speed.current) > 5) {
      setShake(true);
      shakeTime.current = 0.2;
    }

    if (turning && speed.current > 10 && driftBoost.current <= 0) {
      driftBoost.current = 3;
    }
if (keys.current['b'] && !isBoosting.current) {
  isBoosting.current = true;
  boostTime.current = 2; // boost duration in seconds
  speed.current = Math.min(speed.current + 10, 30); // boost limit
}

if (isBoosting.current) {
  boostTime.current -= delta;
  if (boostTime.current <= 0) {
    isBoosting.current = false;
  }
}

// Jump with 'Space'
if (keys.current[' '] && !isJumping.current) {
  isJumping.current = true;
  jumpVelocity.current = 6;
}

if (isJumping.current) {
  kart.position.y += jumpVelocity.current * delta;
  jumpVelocity.current -= 20 * delta;
  if (kart.position.y <= 0.5) {
    kart.position.y = 0.5;
    isJumping.current = false;
  }
}

// Special Move with 'N' (placeholder logic)
if (keys.current['n'] && !specialUsed.current) {
  specialUsed.current = true;
  console.log("Special move activated!");
  // insert character-specific logic later here
}
    kart.rotation.y = rotation.current;

    const forward = new THREE.Vector3(Math.sin(rotation.current), 0, Math.cos(rotation.current));
    let driftMultiplier = driftBoost.current > 0 ? 1.5 : 1;
    const nextPosition = kart.position.clone().addScaledVector(forward, speed.current * driftMultiplier * delta);

    const collision = barrierBoxes.some(box => {
      return nextPosition.x > box.min.x && nextPosition.x < box.max.x && nextPosition.z > box.min.z && nextPosition.z < box.max.z;
    });

    if (!collision) {
      kart.position.copy(nextPosition);
    } else {
      speed.current = -speed.current * 0.5;
    }

    if (driftBoost.current > 0) {
      driftBoost.current -= delta;
      if (driftBoost.current <= 0) driftBoost.current = 0;
    }

    const desiredPosition = new THREE.Vector3(
      kart.position.x - Math.sin(rotation.current) * 5,
      kart.position.y + 3,
      kart.position.z - Math.cos(rotation.current) * 5
    );

    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.copy(kart.position);
    }

    if (camera.position && camera.lookAt) {
      if (shake && shakeTime.current > 0) {
        camera.position.x += (Math.random() - 0.5) * 0.2;
        camera.position.y += (Math.random() - 0.5) * 0.2;
        camera.position.z += (Math.random() - 0.5) * 0.2;
        shakeTime.current -= delta;
      } else {
        setShake(false);
      }
      camera.position.lerp(desiredPosition, 5 * delta);
      camera.lookAt(kart.position);
    }
  });

  return (
    <>
      <mesh ref={kartRef} position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}