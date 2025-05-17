import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeonSpineTrack } from '@/components/neonspinetrack';
import PlayerKart from '@/components/playerkart';
import HUD from '@/components/HUD';
import Link from 'next/link';
import { Physics } from '@react-three/rapier';
import { Stars } from '@react-three/drei';

export default function RaceSimulatorPage() {
  const [started, setStarted] = useState(false);
  const [trackPoints, setTrackPoints] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [inventory, setInventory] = useState([null, null, null]);

  const orbRefs = useRef([]);
  const orbCallback = useRef(null);

  const registerOrbs = (data) => {
    if (Array.isArray(data)) {
      orbRefs.current = data;
      if (typeof orbCallback.current === 'function') {
        orbCallback.current(data);
      }
    } else if (typeof data === 'function') {
      orbCallback.current = data;
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <button
          onClick={() => setStarted(true)}
          className="bg-pink-500 hover:bg-purple-700 text-blue font-bold py-4 px-8 rounded-2xl text-3xl arcade-text transition transform hover:scale-110"
        >
          ENTER CHAOS?
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white">
      <Canvas shadows camera={{ position: [0, 8, 20], fov: 60 }}>
        <color attach="background" args={["#0a0a1f"]} />
        <fog attach="fog" args={["#0a0a1f", 10, 300]} />
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight
          castShadow
          position={[30, 40, 30]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          color="#ffffff"
        />

<Stars radius={300} depth={150} count={8000} factor={4} saturation={0} fade />

        <Suspense fallback={null}>
          <Physics debug gravity={[0, -9.81, 0]}>
            <NeonSpineTrack registerOrbs={registerOrbs} onSampledPoints={setTrackPoints} />
            <PlayerKart registerOrbs={registerOrbs} sampledPoints={trackPoints} setSpeed={setSpeed} />
          </Physics>
        </Suspense>
      </Canvas>

      <HUD speed={speed} inventory={inventory} />

      <div className="fixed top-6 left-6 flex flex-col w-fit z-50 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 space-y-2">
        <Link href="/" className="menu-link">🏁 Home</Link>
        <Link href="/your-racerz" className="menu-link">🎮 Inventory</Link>
        <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
        <Link href="/interactions" className="menu-link">🤖 Interact</Link>
        <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
        <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
      </div>

      <style jsx>{`
        .arcade-text {
          font-family: 'Press Start 2P', monospace;
          color: #00ffff;
          text-shadow: 0 0 6px #0ff, 0 0 12px #f0f;
        }
        .menu-link {
          font-family: 'Share Tech Mono', monospace;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: background 0.2s, transform 0.2s;
        }
        .menu-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

  
