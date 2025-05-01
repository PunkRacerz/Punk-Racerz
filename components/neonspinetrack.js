import { useMemo, useState, useRef, useEffect } from 'react';
import { Vector3, CatmullRomCurve3, TubeGeometry } from 'three';
import pointsData from '../data/trackPoints.json';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export function NeonSpineTrack({ registerOrbs }) {
  const elevatedPoints = pointsData.trackPoints.map(([x, y, z], i) => {
    const newY = (i >= 12 && i <= 16) ? y + 2 : y;
    return [x, newY, z];
  });

  const safeRawPoints = elevatedPoints
    .filter(([x, y, z]) => isFinite(x) && isFinite(y) && isFinite(z))
    .map(([x, y, z]) => new Vector3(x * 2, y, z * 2));

  const curve = useMemo(() => {
    if (safeRawPoints.length < 2) {
      console.error("🚫 Not enough valid points to form curve.");
      return null;
    }
    return new CatmullRomCurve3(safeRawPoints, true, 'catmullrom', 0.75);
  }, [safeRawPoints]);

  const spacedPoints = useMemo(() => {
  if (!curve) return [];
  return curve.getSpacedPoints(100);
}, [curve]);

  const trackGeometry = useMemo(() => {
    if (!curve) return null;
    const geometry = new TubeGeometry(curve, 200, 4, 16, true);
    geometry.scale(1, 0.05, 1);
    geometry.translate(0, -0.2, 0); // optional: adjust vertical alignment // small offset to ensure it sits flush
    return geometry;
  }, [curve]);

  const asphaltColor = useLoader(TextureLoader, '/textures/asphalt_color.jpg');
  const asphaltNormal = useLoader(TextureLoader, '/textures/asphalt_normal.jpg');
  const asphaltRoughness = useLoader(TextureLoader, '/textures/asphalt_roughness.jpg');

  const trackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: asphaltColor,
    normalMap: asphaltNormal,
    roughnessMap: asphaltRoughness,
    emissive: "#ff00ff",
    emissiveIntensity: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide
  }), [asphaltColor, asphaltNormal, asphaltRoughness]);

  const [orbStatus, setOrbStatus] = useState(Array(25).fill(true));
  const orbRefs = useRef([]);

  useEffect(() => {
    if (
      typeof registerOrbs === 'function' &&
      orbRefs.current.length === orbStatus.length &&
      orbRefs.current.every(ref => ref && ref.position)
    ) {
      registerOrbs(orbRefs.current);
    }
  }, [orbStatus, registerOrbs]);

  return (
    <group>
      <line>
        <bufferGeometry attach="geometry" setFromPoints={spacedPoints} />
        <lineBasicMaterial attach="material" color="yellow" linewidth={2} />
      </line>
      {trackGeometry && (
        <RigidBody type="fixed" colliders="trimesh">
          <mesh geometry={trackGeometry} castShadow receiveShadow material={trackMaterial} />
        </RigidBody>
      )}

      {orbStatus.map((active, idx) => {
        const baseIdx = Math.floor((idx / orbStatus.length) * spacedPoints.length);
        const point = spacedPoints[baseIdx];
        if (!point) return null;

        const orbPos = point.clone().add(new Vector3((idx % 5 - 2) * 1.8, 0.8, 0));
        return (
          <group key={`orb-${idx}`} position={[orbPos.x, orbPos.y, orbPos.z]}>
            <mesh
              ref={(ref) => { if (ref) orbRefs.current[idx] = ref; }}
              visible={active}
            >
              <sphereGeometry args={[0.3, 12, 12]} />
              <meshStandardMaterial color="cyan" emissive="#00ffff" emissiveIntensity={1} />
            </mesh>
          </group>
        );
      })}

      <CityBackground />
    </group>
  );
}

function CityBackground() {
  const instanceRef = useRef();
  const count = 50;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heights = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 800 - 400,
      z: Math.random() * 800 - 400,
      height: Math.random() * 60 + 20
    }));
  }, []);

  useEffect(() => {
    heights.forEach((b, i) => {
      dummy.position.set(b.x, b.height / 2, b.z);
      dummy.scale.set(1, b.height / 8, 1);
      dummy.updateMatrix();
      instanceRef.current.setMatrixAt(i, dummy.matrix);
    });
    instanceRef.current.instanceMatrix.needsUpdate = true;
  }, [heights, dummy]);

  return (
    <instancedMesh
      ref={instanceRef}
      args={[null, null, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[8, 8, 8]} />
      <meshStandardMaterial
        color="#111"
        emissive="#0ff"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

export default CityBackground;

