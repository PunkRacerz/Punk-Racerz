import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PlayerKart from '@/components/playerkart';
import { NeonSpineTrack } from '@/components/neonspinetrack'; // ← Note the curly braces!
import Link from 'next/link';

export default function RaceSimulatorPage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <button
          onClick={() => setStarted(true)}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-2xl text-3xl arcade-text transition transform hover:scale-110"
        >
          PLAY?
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-center text-4xl font-bold py-6 arcade-text">PUNKRACERZ</h1>
      <div className="relative w-full h-screen">
        <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
          <color attach="background" args={["#0a0a1f"]} />
          <fog attach="fog" args={["#0a0a1f", 10, 300]} />
          <ambientLight intensity={2} color="#ff00ff" />
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            intensity={2.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            color="#00ffff"
          />
          <PlayerKart />
          <NeonSpineTrack />
        </Canvas>

        {/* Navigation Menu */}
        <div className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex flex-col space-y-2">
          <Link href="/" className="menu-link">🏁 Home</Link>
          <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
          <Link href="/interactions" className="menu-link">🤖 Interact</Link>
          <Link href="/ceo-message" className="menu-link">👑 CEO Message</Link>
          <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
          <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
          <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
        </div>
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
  
