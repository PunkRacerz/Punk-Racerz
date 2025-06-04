import React, { useState } from 'react';
import Link from 'next/link';
const racers = [
  'Spark', 'GlitchFang', 'Nova-13', 'Venoma', 'Blizzard.EXE', 'ScrapDrift',
  'Eclipse9', 'Zosi', 'Solstice', 'RazorByte', 'Ignis-Vyre'
];

export default function RacerSelect({ onSelect }) {
    const [hovered, setHovered] = useState(null);
  
    return (
      <div
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          padding: '40px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/30 backdrop-blur-md text-white flex flex-wrap justify-center gap-6 text-sm font-medium border-b border-pink-500 shadow-md">
        <Link href="/" className="hover:underline">🏁 Home</Link>
        <Link href="/your-racerz" className="hover:underline">🎮 Inventory</Link>
        <Link href="/punkx" className="hover:underline">PunkX</Link>
        <Link href="/the-cyber-times" className="hover:underline"> Newz Feed</Link>
        <Link href="/weather-forecast" className="hover:underline">⛈ Weather</Link>
        <Link href="/interactions" className="hover:underline">🤖 Interact</Link>
        <Link href="/wallet-page" className="hover:underline">💰 Wallet</Link>
        <Link href="/weekly-messages" className="hover:underline">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="hover:underline">🎮 Race Simulator</Link>
      </nav>
      
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#ffccff' }}>Select Your Racer</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            maxWidth: '1400px',
            width: '100%'
          }}
        >
          {racers.map((racer) => (
            <div
              key={racer}
              onMouseEnter={() => setHovered(racer)}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                onSelect({
                  name: racer,
                  image: `/racers/${racer}.png`,
                  glb: `/karts/${racer.toLowerCase()}-kart.glb`
                })
              }
              style={{
                cursor: 'pointer',
                background: hovered === racer ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                border: hovered === racer ? '2px solid #ff00cc' : '2px solid transparent',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              <img
                src={`/racers/${racer}.png`}
                alt={racer}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ textAlign: 'center', padding: '10px 0', color: '#ffccff', fontWeight: 'bold' }}>
                {racer}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
