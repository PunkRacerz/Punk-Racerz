import { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import NeonSpineTrack from '@/components/neonspinetrack';
import PlayerKart from '@/components/playerkart';
import HUD from '@/components/HUD';
import Link from 'next/link';
import { Physics } from '@react-three/rapier';
import { Stars } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import RacerSelect from '@/components/RacerSelect';
import LoadingScreen from '@/components/LoadingScreen';

export default function RaceSimulatorPage() {
  const [selectedRacer, setSelectedRacer] = useState(null);
  const [trackPoints, setTrackPoints] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [inventory, setInventory] = useState([null, null, null]);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [lap, setLap] = useState(0);
  const [orbCount, setOrbCount] = useState(0);

  const totalLaps = 3;
  const orbRefs = useRef([]);
  const orbCallback = useRef(null);
  const loaderRef = useRef(new GLTFLoader());

  const kartPath = useMemo(() => {
    if (!selectedRacer) return null;
    const path = `/karts/${selectedRacer.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-kart.glb`;
    console.log("🛞 Kart GLB path:", path);
    return path;
  }, [selectedRacer]);

  const handleLap = () => {
    setLap((prev) => {
      const next = prev + 1;
      console.log(`🏁 Lap ${next} completed`);
      if (next >= totalLaps) {
        console.log("🎉 Race finished!");
      }
      return next;
    });
    setOrbCount(0); // Reset orbs per lap
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!orbRefs.current.length) return;
      const playerKart = document.querySelector('[name="playerKart"]');
      const pos = playerKart?.rigidBody?.translation();
      if (!pos) return;
      const playerPos = [pos.x, pos.y, pos.z];
      orbRefs.current.forEach((orb, idx) => {
        if (!orb.visible) return;
        const dx = orb.position.x - playerPos[0];
        const dy = orb.position.y - playerPos[1];
        const dz = orb.position.z - playerPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2) {
          orb.visible = false;
          setOrbCount((prev) => Math.min(prev + 1, 3));
          console.log(`✨ Orb collected. Total: ${orbCount + 1}`);
        }
      });
    }, 200);
    return () => clearInterval(interval);
  }, [orbCount]);

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

  const handleTrackReady = (points) => {
    console.log("✅ handleTrackReady called with", points?.length, "points");
    if (points && points.length > 0) {
      setTrackPoints(points);
    }
  };

  if (!selectedRacer) {
    return <RacerSelect onSelect={setSelectedRacer} />;
  }

  return (
    <>
      {/* 3D Scene */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
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
              <NeonSpineTrack
                registerOrbs={registerOrbs}
                onSampledPoints={(points) => {
                  console.log("📤 NeonSpineTrack sent points:", points?.length);
                  handleTrackReady(points);
                }}
                onLap={handleLap}
              />
              {isReadyToStart && kartPath && (
                <PlayerKart
                  registerOrbs={registerOrbs}
                  sampledPoints={trackPoints}
                  setSpeed={setSpeed}
                  glbPath={kartPath}
                  orbCount={orbCount}
                  setOrbCount={setOrbCount}
                  selectedRacer={selectedRacer}
                />
              )}
            </Physics>
          </Suspense>
        </Canvas>
      </div>

      {/* HUD */}
      {isReadyToStart && <HUD speed={speed} inventory={inventory} lap={lap + 1} totalLaps={totalLaps} />}

      {/* Loading Screen */}
      {!isReadyToStart && (
        <LoadingScreen
          isLoaded={trackPoints.length > 0}
          onStart={() => {
            console.log("▶️ START button pressed!");
            setIsReadyToStart(true);
          }}
        />
      )}

      {/* Nav Menu */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/30 backdrop-blur-md text-white flex flex-wrap justify-center gap-6 text-sm font-medium border-b border-pink-500 shadow-md">
        <Link href="/" className="hover:underline">🏁 Home</Link>
        <Link href="/your-racerz" className="hover:underline">🎮 Inventory</Link>
        <Link href="/punkx" className="hover:underline">PunkX</Link>
        <Link href="/the-cyber-times" className="hover:underline">Newz Feed</Link>
        <Link href="/weather-forecast" className="hover:underline">⛈ Weather</Link>
        <Link href="/interactions" className="hover:underline">🤖 Interact</Link>
        <Link href="/wallet-page" className="hover:underline">💰 Wallet</Link>
        <Link href="/weekly-messages" className="hover:underline">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="hover:underline">🎮 Race Simulator</Link>
      </nav>

      <style jsx>{`
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
    </>
  );
}



  
  



  
