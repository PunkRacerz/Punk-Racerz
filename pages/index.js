import Image from 'next/image';
import { useState } from 'react';

const racers = [
  {
    name: 'Nova-13',
    image: '/racers/nova-13.png',
    backstory: `Lawful Good\nPrecision on dry, urban tracks\nStrengths: Flawless cornering, optimized for cityscapes\nWeaknesses: Struggles in off-road and extreme weather\nPersonality: Noble, methodical, and calculated—races to uphold cybernetic honor`,
  },
  {
    name: 'GlitchFang',
    image: '/racers/glitchfang.png',
    backstory: `Chaotic Evil\nThrives in electrical storms\nStrengths: Unpredictable and aggressive\nWeaknesses: Overheats, malfunctions on clean circuits\nPersonality: Sadistic hacker AI feeding on system chaos`,
  },
  {
    name: 'Solstice',
    image: '/racers/solstice.png',
    backstory: `Neutral Good\nDesert and sunlight enhanced\nStrengths: Accelerates under sunlight\nWeaknesses: Weak in rain/night\nPersonality: Peaceful, believes in purity of speed`,
  },
  {
    name: 'RazorByte',
    image: '/racers/razorbyte.png',
    backstory: `Lawful Evil\nNeon city specialist\nStrengths: Ruthless cornering\nWeaknesses: Poor in nature\nPersonality: Cold, corporate assassin AI`,
  },
  {
    name: 'Aether-X',
    image: '/racers/aether-x.png',
    backstory: `True Neutral\nHigh-altitude, fog specialty\nStrengths: Spatial awareness\nWeaknesses: EMI vulnerable\nPersonality: Mysterious, logical`,
  },
  {
    name: 'ScrapDrift',
    image: '/racers/scrapdrift.png',
    backstory: `Chaotic Neutral\nGravel/junkyard mastery\nStrengths: Durable and self-repairing\nWeaknesses: Slow on smooth roads\nPersonality: Punk-rock glitch bot`,
  },
  {
    name: 'SilkRaid',
    image: '/racers/silkraid.png',
    backstory: `Neutral Evil\nRain master\nStrengths: Hydro-adaptive\nWeaknesses: Overheats in dry zones\nPersonality: Elegant and deceitful`,
  },
  {
    name: 'Ignis Vyre',
    image: '/racers/ignis-vyre.png',
    backstory: `Chaotic Good\nVolcanic circuit pro\nStrengths: Fireproof turbo systems\nWeaknesses: Fails in cold\nPersonality: Flamboyant rebel`,
  },
  {
    name: 'Blizzard.EXE',
    image: '/racers/blizzard.png',
    backstory: `Lawful Neutral\nIcy terrain specialist\nStrengths: Adaptive systems\nWeaknesses: Fails in heat\nPersonality: Cold, calculating`,
  },
  {
    name: 'Venoma',
    image: '/racers/venoma.png',
    backstory: `Neutral Evil\nToxic waste expert\nStrengths: Thrives in pollution\nWeaknesses: Weak in sterile zones\nPersonality: Seductive, saboteur`,
  },
  {
    name: 'Spark',
    image: '/racers/sparkhavok.png',
    backstory: `Chaotic Neutral\nThrives in chaos\nStrengths: Acceleration in storms\nWeaknesses: Fails on tight tracks\nPersonality: Speed-hungry prankster`,
  },
  {
    name: 'Eclipse.9',
    image: '/racers/eclipse9.png',
    backstory: `True Evil\nDark circuit hunter\nStrengths: Stealth in darkness\nWeaknesses: Daylight disorients\nPersonality: Silent eliminator`,
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="w-full text-center text-5xl md:text-7xl font-extrabold tracking-tight lightning-text">
          PUNKRACERZ
        </h1>
        <div className="w-16 md:w-20">
          <Image src="/logo.png" alt="PunkRacerz Logo" width={80} height={80} />
        </div>
      </div>

      {/* Racer Flip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {racers.map((racer, index) => (
          <div key={index} className="relative w-full h-[460px] perspective">
            <div className="relative w-full h-full transition-transform duration-700 transform-style preserve-3d hover:rotate-y-180">
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg overflow-hidden">
                <Image
                  src={racer.image}
                  alt={racer.name}
                  width={300}
                  height={450}
                  className="rounded-xl w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-60 py-2 text-center font-bold text-lg">
                  {racer.name}
                </div>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg bg-gradient-to-br from-purple-900 to-black text-sm p-4 border border-pink-500 flex items-center justify-center text-center whitespace-pre-wrap">
                {racer.backstory}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .lightning-text {
          background: linear-gradient(to top, #ff00cc, #9900ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: Impact, Charcoal, fantasy;
          text-shadow: 0 0 5px #ff00cc, 0 0 10px #9900ff, 0 0 20px #ff00cc;
        }
        .perspective {
          perspective: 1000px;
        }
        .transform-style {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}