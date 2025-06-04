import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Vector3, CatmullRomCurve3, TubeGeometry } from 'three';
import pointsData from '../data/trackPoints.json';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import FinishLineTrigger from '@/components/FinishLineTrigger';

export default function NeonSpineTrack({ registerOrbs, registerTrack, onSampledPoints, onLap }) {
  const elevatedPoints = useMemo(() => pointsData.points.map((p) => {
    const [x, y, z] = Array.isArray(p) ? p : [p.x, p.y, p.z];
    return new Vector3(x * 2, y * 1, z * 2);
  }), []);

  const curve = useMemo(() => new CatmullRomCurve3(elevatedPoints, true, 'catmullrom', 0.75), [elevatedPoints]);

  const spacedPoints = useMemo(() => curve.getSpacedPoints(400), [curve]);

  const trackWidth = 22;

  useEffect(() => {
    window.sampledTrackPoints = spacedPoints.map(p => ({ x: p.x, y: p.y, z: p.z }));
  }, [spacedPoints]);

  const trackGeometry = useMemo(() => {
    const frames = curve.computeFrenetFrames(90, true);
    const positions = [];
    const normals = [];
    const width = 20;

    for (let i = 0; i < frames.tangents.length; i++) {
      const point = curve.getPointAt(i / (frames.tangents.length - 1));
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];

      const offset = binormal.clone().normalize().multiplyScalar(width / 2);
      const left = point.clone().sub(offset);
      const right = point.clone().add(offset);

      positions.push(left.x, left.y, left.z);
      positions.push(right.x, right.y, right.z);

      normals.push(normal.x, normal.y, normal.z);
      normals.push(normal.x, normal.y, normal.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    const indices = [];
    for (let i = 0; i < frames.tangents.length - 1; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = i * 2 + 2;
      const d = i * 2 + 3;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }, [curve]);

  const debugCurve = useMemo(() => new CatmullRomCurve3(spacedPoints, true, 'catmullrom', 0.75), [spacedPoints]);

  const trackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#444',
    metalness: 0.05,
    roughness: 0.85,
    side: THREE.DoubleSide,
  }), []);

  const [orbStatus, setOrbStatus] = useState(Array(25).fill(true));
  const orbRefs = useRef([]);
  const sentSamplePoints = useRef(false);

  useEffect(() => {
    if (
      typeof registerOrbs === 'function' &&
      orbRefs.current.length === orbStatus.length &&
      orbRefs.current.every(ref => ref && ref.position)
    ) {
      registerOrbs(orbRefs.current);
    }
  }, [orbStatus, registerOrbs]);

  const trackRef = useRef();

  useEffect(() => {
    if (!sentSamplePoints.current && typeof onSampledPoints === 'function') {
      console.log("📤 NeonSpineTrack: Calling onSampledPoints");
      onSampledPoints(spacedPoints);
      sentSamplePoints.current = true;
    }
  }, [onSampledPoints, spacedPoints]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[debugCurve, 100, 0.3, 3, true]} />
        <meshBasicMaterial color="yellow" />
      </mesh>

      {trackGeometry && (
        <RigidBody key={trackGeometry.uuid} ref={trackRef} type="fixed" colliders="trimesh">
          <mesh geometry={trackGeometry} castShadow receiveShadow material={trackMaterial} />
        </RigidBody>
      )}

      <FinishLineTrigger
        position={[0, 1, 0]}
        size={[10, 2, 0.2]}
        onCross={() => {
          console.log("🏁 Finish line crossed!");
          if (typeof onLap === 'function') onLap();
        }}
      />
      {/* ✅ Start/Finish Line Gate */}
{(() => {
  const index = pointsData.startIndex || 0;
  const next = (index + 1) % elevatedPoints.length;
  const pointA = elevatedPoints[index];
  const pointB = elevatedPoints[next];

  const direction = new Vector3().subVectors(pointB, pointA).normalize();
  const up = new Vector3(0, 1, 0);
  const cross = new Vector3().crossVectors(direction, up).normalize();
  const gatePos = pointA.clone().add(new Vector3(0, 0, 0));
  const angle = Math.atan2(cross.x, cross.z);

  const color = "white";
  const emissive = "#ffffff";
  const intensity = 2;

  return (
    <group position={gatePos} rotation={[0, angle, 0]}>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[trackWidth, 0.6, 0.6]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={intensity} />
      </mesh>
      <mesh position={[-trackWidth / 2 + 0.3, 2.5, 0]}>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#222" emissive={emissive} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[trackWidth / 2 - 0.3, 2.5, 0]}>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#222" emissive={emissive} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
})()}

  
      {/* ✅ Orbs */}
      {orbStatus.map((active, idx) => {
        const baseIdx = Math.floor((idx / orbStatus.length) * spacedPoints.length);
        const point = spacedPoints[baseIdx];
        if (!point) return null;
  
        const orbPos = point.clone().add(new Vector3((idx % 5 - 2) * 1.8, 1.2, 0));
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


export { CityBackground };




