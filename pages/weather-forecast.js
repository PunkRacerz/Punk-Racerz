import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { motion } from 'framer-motion';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const weatherEffects = {
  "Super Snow": {
    "Blizzard.EXE": "+10%",
    "Eclipse.9": "+5%",
    "Ignis Vyre": "-10%",
    "Solstice": "-5%",
    "Spark": "-5%",
    "GlitchFang": "-5%",
    "ScrapDrift": "0%",
    "Nova-13": "+5%",
    "Zosi": "+5%",
    "Aether-X": "0%",
    "Venoma": "0%",
    "Razorbyte": "-5%",
  },
  "Rabbit Rain": {
    Spark: "+10%",
    GlitchFang: "+5%",
    ScrapDrift: "+5%",
    Zosi: "0%",
    Solstice: "-5%",
    Venoma: "-5%",
    "Blizzard.EXE": "-10%",
    "Nova-13": "-5%",
    "Eclipse.9": "0%",
    "Ignis Vyre": "-10%",
    "Aether-X": "0%",
    "Razorbyte": "+5%",
  },
  "Fire Fog": {
    Spark: "0%",
    "Ignis Vyre": "+10%",
    Solstice: "+5%",
    Zosi: "+5%",
    Venoma: "+5%",
    "Blizzard.EXE": "-10%",
    "GlitchFang": "-5%",
    "Eclipse.9": "-5%",
    "Razorbyte": "0%",
    "Nova-13": "-5%",
    ScrapDrift: "+5%",
    "Aether-X": "+5%",
  },
};

const weatherAnimations = {
  "Super Snow": '❄️',
  "Rabbit Rain": '🐰',
  "Fire Fog": '🔥',
};

export default function WeatherForecast() {
  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 py-8 relative overflow-hidden">
      {/* Weather Particles */}
      {Object.entries(weatherAnimations).map(([weather, icon]) => (
        <div key={weather} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl select-none"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: '110vh', opacity: 1 }}
              transition={{ duration: Math.random() * 4 + 4, delay: Math.random() * 5, repeat: Infinity }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      ))}

      <div className="absolute top-6 left-6 flex flex-col w-fit z-20">
        <a href="/" className="panel-link rounded-t-md">🏁 Home</a>
        <a href="/weekly-track-report" className="panel-link">📈 Weekly Report</a>
        <a href="/weather-forecast" className="panel-link">⛈ Weather</a>
        <a href="/interactions" className="panel-link">🤖 Interact</a>
        <a href="/ceo-message" className="panel-link rounded-b-md">👑 CEO Message</a>
      </div>

      <motion.div className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}>
        <h1 className="text-center text-5xl md:text-6xl font-bold mb-16 text-white tracking-wider" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          ☁️ Weather Forecast Channel
        </h1>

        {Object.entries(weatherEffects).map(([weather, racers]) => (
          <motion.div
            key={weather}
            className="text-center p-8 rounded-3xl bg-black bg-opacity-50 backdrop-blur-xl shadow-2xl mx-auto max-w-3xl mb-20 border border-black transition-transform duration-300 hover:scale-[1.01]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image src={`/${weather.toLowerCase().replace(/ /g, '-')}.png`} alt={weather} width={240} height={160} className="mx-auto rounded-xl border border-white border-opacity-10 shadow-lg" />
            <h2 className="text-4xl mt-6 font-extrabold tracking-wide text-white uppercase" style={{ fontFamily: 'Share Tech Mono, monospace' }}>{weather}</h2>
            <p className="mt-4 text-base italic text-gray-300 max-w-xl mx-auto">
              {weather === 'Super Snow' && 'The sky vomits snowman heads. Carrot noses everywhere. Visibility down, chaos up. Cold enough to make AI circuits tremble.'}
              {weather === 'Rabbit Rain' && 'Rabbits fall from the sky. Not metaphorically—actual, cartoonish rabbits, soft and squeaky. No one knows why. No one can stop it. Some say GlitchFang wished for this in his sleep. Others blame Spark. The sky is just... full of bunnies.'}
              {weather === 'Fire Fog' && 'Hot, thick smoke mixed with firestorms and glowing ash. Breathing not advised. Seeing optional. Cook your steak on the hood.'}
            </p>
            <h3 className="text-2xl font-bold mt-10 mb-4 text-white tracking-tight">🎲 To Boost or Not to Boost?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-white">
              {Object.entries(racers).map(([racer, effect]) => (
                <div key={racer} className="flex justify-between px-4 py-3 bg-black bg-opacity-70 rounded-md border border-black hover:bg-opacity-90">
                  <span className="font-semibold tracking-wide">{racer}</span>
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style jsx>{`
        .panel-link {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-weight: bold;
          text-align: left;
          transition: all 0.2s ease-in-out;
        }
        .panel-link:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}