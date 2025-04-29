import { useMemo, useState, useRef, useEffect } from 'react';
import { Vector3, CatmullRomCurve3 } from 'three';
import { Line } from '@react-three/drei';
import pointsData from '../data/trackPoints.json';

export function NeonSpineTrack({ registerOrbs }) {
  const points = useMemo(() => pointsData.trackPoints.map(([x, z]) => new Vector3(x * 8, 0, z * 12)), []);
  const curve = useMemo(() => new CatmullRomCurve3(points, true, 'catmullrom', 1), [points]);
  const sampledPoints = useMemo(() => curve.getPoints(800), [curve]);

  const [orbStatus, setOrbStatus] = useState(Array(25).fill(true)); // 5 groups × 5 orbs
  const orbRefs = useRef([]);
  orbRefs.current = [];

  const handleOrbPickup = (index) => {
    setOrbStatus((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setTimeout(() => {
      setOrbStatus((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    }, 5000);
  };

  useEffect(() => {
    if (registerOrbs) {
      registerOrbs(orbRefs);
    }
  }, [registerOrbs]);

  return (
    <group>
      {/* Track segments */}
      {sampledPoints.map((point, idx) => {
        if (idx >= sampledPoints.length - 1) return null;
        const nextPoint = sampledPoints[idx + 1];
        const direction = new Vector3().subVectors(nextPoint, point).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        const distance = point.distanceTo(nextPoint);
        if (distance < 0.01) return null;

        return (
          <group key={idx} position={[point.x, 0, point.z]} rotation={[0, angle, 0]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[10, 0.5, distance]} />
              <meshStandardMaterial
                color="#111"
                emissive="#ff00ff"
                emissiveIntensity={0.6}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}

      {/* Racing Line */}
      <Line points={curve.getPoints(300)} color="hotpink" lineWidth={2} />

      {/* Orbs */}
      {orbStatus.map((active, idx) => {
        if (!active) return null;

        const groupIndex = Math.floor(idx / 5);
        const offsetIndex = idx % 5;
        const base = groupIndex * Math.floor(sampledPoints.length / 5);
        const orbIndex = base + offsetIndex * 5;
        const orbPoint = sampledPoints[orbIndex];
        if (!orbPoint) return null;

        const lateral = (offsetIndex - 2) * 2.5;
        const forward = new Vector3().subVectors(sampledPoints[orbIndex + 1] || orbPoint, orbPoint).normalize();
        const right = new Vector3().crossVectors(forward, new Vector3(0, 1, 0)).normalize();
        const orbPos = orbPoint.clone().add(right.multiplyScalar(lateral));

        return (
          <mesh
            key={`orb-${idx}`}
            ref={(ref) => (orbRefs.current[idx] = ref)}
            position={[orbPos.x, 2, orbPos.z]}
          >
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="cyan" emissive="#00ffff" emissiveIntensity={1} />
          </mesh>
        );
      })}

      <CityBackground />
    </group>
  );
}

function CityBackground() {
  const buildings = [];

  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 800 - 400;
    const z = Math.random() * 800 - 400;
    const height = Math.random() * 60 + 20;

    buildings.push(
      <mesh key={i} position={[x, height / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[8, height, 8]} />
        <meshStandardMaterial color="#111" emissive="#0ff" emissiveIntensity={0.3} />
      </mesh>
    );
  }

  return <group>{buildings}</group>;
}