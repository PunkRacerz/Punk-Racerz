import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const racers = [
  { name: 'Nova-13', odds: 5.2, image: '/racers/nova-13.png' },
  { name: 'GlitchFang', odds: 4.8, image: '/racers/glitchfang.png' },
  { name: 'Solstice', odds: 6.3, image: '/racers/solstice.png' },
  { name: 'RazorByte', odds: 4.2, image: '/racers/razorbyte.png' },
  { name: 'Aether-X', odds: 9.1, image: '/racers/aether-x.png' },
  { name: 'ScrapDrift', odds: 7.4, image: '/racers/scrapdrift.png' },
  { name: 'Zosi', odds: 5.9, image: '/racers/zosi.png' },
  { name: 'Ignis Vyre', odds: 6.0, image: '/racers/ignis-vyre.png' },
  { name: 'Blizzard.EXE', odds: 3.7, image: '/racers/blizzard.png' },
  { name: 'Venoma', odds: 8.5, image: '/racers/venoma.png' },
  { name: 'Spark', odds: 5.6, image: '/racers/spark.png' },
  { name: 'Eclipse.9', odds: 3.2, image: '/racers/eclipse9.png' },
];

const weatherEffectsMap = {
  'Super Snow': {
    'Blizzard.EXE': 17,
    'Eclipse.9': 5,
    'Ignis Vyre': -10,
    'Solstice': -5,
    'Spark': -5,
    'GlitchFang': -5,
    'ScrapDrift': 0,
    'Nova-13': 5,
    'Zosi': 5,
    'Aether-X': 0,
    'Venoma': 0,
    'RazorByte': -5,
  },
  'Rabbit Rain': {
    'Spark': 10,
    'GlitchFang': 5,
    'ScrapDrift': 5,
    'Zosi': 0,
    'Solstice': -5,
    'Venoma': -5,
    'Blizzard.EXE': -12,
    'Nova-13': -5,
    'Eclipse.9': -38,
    'Ignis Vyre': -10,
    'Aether-X': 0,
    'RazorByte': 5,
  },
  'Fire Fog': {
    'Spark': 0,
    'Ignis Vyre': 15,
    'Solstice': 5,
    'Zosi': 5,
    'Venoma': 5,
    'Blizzard.EXE': -35,
    'GlitchFang': -5,
    'Eclipse.9': -5,
    'RazorByte': 0,
    'Nova-13': -15,
    'ScrapDrift': 5,
    'Aether-X': 10,
  },
};

const [startAnimation, setStartAnimation] = useState(false);

const trackPath = "M10,300 Q150,50 300,300 T590,300"; // S-curve

function simulateRace(racers, weatherEffects) {
  return racers
    .map(r => {
      const effect = weatherEffects[r.name] || 0;
      const baseScore = 100 / r.odds;
      const score = baseScore * (1 + effect / 100);
      return { ...r, score };
    })
    .sort((a, b) => b.score - a.score);
}

export default function RaceSimulator() {
  const [results, setResults] = useState([]);
  const [isRacing, setIsRacing] = useState(false);
  const [animatedPositions, setAnimatedPositions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [showDice, setShowDice] = useState(false);
  const [showHud, setShowHud] = useState(false);

  const handleStartRace = () => {
    setShowDice(true);
    setShowHud(true);
    setResults([]);
    setWeather(null);
    setDiceRoll(null);
    setAnimatedPositions(racers.map(r => ({ name: r.name, x: 0 })));

    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 6);
      setDiceRoll(roll);
      const rolledWeather = roll === 1 || roll === 4 ? 'Super Snow' : roll === 2 || roll === 5 ? 'Rabbit Rain' : 'Fire Fog';
      setWeather(rolledWeather);
      const effects = weatherEffectsMap[rolledWeather];
      setShowHud(false);
      setIsRacing(true);

      const outcome = simulateRace(racers, effects);
      const duration = 5000;
      const frameCount = 100;
      const interval = duration / frameCount;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setAnimatedPositions(
          outcome.map((r, i) => {
            const progress = Math.min(step / frameCount, 1);
            return {
              name: r.name,
              x: progress * (100 - i * 8)
            };
          })
        );
        if (step >= frameCount) {
          clearInterval(timer);
          setResults(outcome);
          setIsRacing(false);
        }
      }, interval);
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-cover bg-center text-white font-sans px-6 py-8 relative overflow-hidden`} style={{ backgroundImage: "url('/background.png')" }}>
      <div className="fixed top-6 left-6 flex flex-col w-fit z-20">
        <a href="/" className="panel-link rounded-t-md">🏁 Home</a>
        <a href="/weather-forecast" className="panel-link">⛈ Weather</a>
        <a href="/interactions" className="panel-link">🤖 Interact</a>
        <a href="/ceo-message" className="panel-link">👑 CEO Message</a>
        <a href="/wallet-page" className="panel-link">💰 Wallet</a>
        <a href="/weekly-messages" className="panel-link">📈 Weekly Announcements</a>
        <a href="/race-simulator" className="panel-link rounded-b-md">🎮 Race Simulator</a>
      </div>

      {showHud && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-center text-cyan-300 font-mono">
          <h1 className="text-6xl font-bold text-pink-500 mb-4">NEON SPINE EXPRESS</h1>
          <p className="text-2xl mb-2">LOADING...</p>
          <div className="border border-cyan-300 p-4 rounded-xl">
            <p><strong>CIRCUIT</strong></p>
            <p>Location: MegaCity-9</p>
            <p>Length: 6.8 km</p>
            <p>Weather: Dry, low humidity</p>
          </div>
          <Image src="/neon-spine-layout.png" alt="Track Layout" width={200} height={300} className="mt-6" />
        </div>
      )}

      <h1 className="text-center text-4xl md:text-5xl font-bold mt-16 mb-10 arcade-text">PUNKRACERZ SIMULATOR</h1>

      <div className="text-center mb-6">
        <button onClick={() => setStartAnimation(true)} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg font-bold text-white">
          🏁 Start Race
        </button>
      </div>

      {showDice && (
        <div className="text-center mt-6 text-3xl z-10 relative">
          Rolling Dice... 🎲 {diceRoll ? `Rolled a ${diceRoll}` : ''}
          {weather && <div className="mt-2 text-xl font-semibold">🌦 Weather: {weather}</div>}
        </div>
      )}

      {weather && [...Array(30)].map((_, i) => (
        <motion.div
          key={`${weather}-${i}`}
          className="absolute text-3xl select-none z-0"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: '110vh', opacity: 1 }}
          transition={{ duration: Math.random() * 4 + 4, delay: Math.random() * 5, repeat: Infinity }}
        >
          {weather === 'Super Snow' ? '❄️' : weather === 'Rabbit Rain' ? '🐰' : '🔥'}
        </motion.div>
      ))}

<svg viewBox="0 0 800 400" className="mx-auto block w-full max-w-4xl h-[300px]">
        <path id="trackPath" fill="none" stroke="#ffffff33" strokeWidth="3"
          d="M100,200 C200,50 600,50 700,200 S600,350 400,200 S200,350 100,200" />

{startAnimation && racers.map((racer, index) => (
          <motion.image
            key={racer.name}
            href={racer.image}
            width="32"
            height="32"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: `${Math.random() * 100}%` }}
            transition={{ duration: 5 + Math.random() * 3, ease: 'linear' }}
            style={{ offsetPath: 'path("M100,200 C200,50 600,50 700,200 S600,350 400,200 S200,350 100,200")', offsetRotate: 'auto' }}
          />
        ))}
      </svg>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 max-w-3xl mx-auto bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg z-10 relative"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">🏁 Race Results</h2>
          <ol className="list-decimal pl-6 space-y-2">
            {results.map((racer, i) => (
              <li key={i} className={`flex items-center gap-3 ${i === 0 ? 'text-yellow-300 font-bold' : ''}`}>
                <Image src={racer.image} alt={racer.name} width={30} height={30} className="rounded-full" />
                {racer.name} — Odds: {racer.odds}x
              </li>
            ))}
          </ol>
        </motion.div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .arcade-text {
          font-family: 'Press Start 2P', monospace;
          color: #00ffff;
          text-shadow: 0 0 6px #0ff, 0 0 12px #f0f;
        }
        .panel-link {
          display: block;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-weight: bold;
          text-align: center;
          margin-bottom: 0.25rem;
          transition: all 0.2s ease-in-out;
        }
        .panel-link:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}