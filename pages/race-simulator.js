import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

export default function PunkKartPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-center text-4xl font-bold py-6 arcade-text">PUNKRACING</h1>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <BasicTrack />
        <PlayerKart />
      </Canvas>

      <style jsx>{`
        .arcade-text {
          font-family: 'Press Start 2P', monospace;
          color: #00ffff;
          text-shadow: 0 0 6px #0ff, 0 0 12px #f0f;
        }
      `}</style>
    </div>
  );
}

function BasicTrack() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

function PlayerKart() {
  const kartRef = useRef();
  const [position, setPosition] = useState([0, 0.5, 0]);

  return (
    <mesh ref={kartRef} position={position}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
