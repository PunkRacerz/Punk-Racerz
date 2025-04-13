import Image from 'next/image';
import { useState } from 'react';

const racers = [
  {
    name: 'NOVA-13',
    image: '/racers/nova-13.png',
    backstory: `Alignment: Lawful Good\nSpecialty: Precision on dry, urban tracks\nStrengths: Flawless cornering, optimized for cityscapes\nWeaknesses: Struggles in off-road and extreme weather\nPersonality: Noble, methodical, and calculated—races to uphold cybernetic honor`,
  },
  {
    name: 'GlitchFang',
    image: '/racers/glitchfang.png',
    backstory: `Alignment: Chaotic Evil\nSpecialty: Disrupts sensors, thrives in electrical storms\nStrengths: Unpredictable and aggressive in high-voltage conditions\nWeaknesses: Overheats in hot weather, malfunctions on clean circuits\nPersonality: Sadistic hacker AI who feeds on system chaos`,
  },
  {
    name: 'SOLSTICE',
    image: '/racers/solstice.png',
    backstory: `Alignment: Neutral Good\nSpecialty: Solar-enhanced desert tracks\nStrengths: Accelerates under direct sunlight, heat-efficient\nWeaknesses: Underperforms in rain or nighttime races\nPersonality: Peaceful and serene, believes in the purity of speed`,
  },
  {
    name: 'RazorByte',
    image: '/racers/razorbyte.png',
    backstory: `Alignment: Lawful Evil\nSpecialty: Sharp turns and neon-lit cityscapes\nStrengths: Ruthless cornering tactics, cyber warfare specialist\nWeaknesses: Poor adaptability in organic or natural environments\nPersonality: Cold, corporate assassin AI programmed for perfection`,
  },
  {
    name: 'AETHER-X',
    image: '/racers/aether-x.png',
    backstory: `Alignment: True Neutral\nSpecialty: High-altitude mountain passes and foggy circuits\nStrengths: Incredible spatial awareness in low visibility\nWeaknesses: Vulnerable to electromagnetic interference\nPersonality: Mysterious, emotionless; driven only by logic`,
  },
  {
    name: 'SCRAPDRIFT',
    image: '/racers/scrapdrift.png',
    backstory: `Alignment: Chaotic Neutral\nSpecialty: Gravel and junkyard tracks\nStrengths: Self-repairing and durable on rough terrain\nWeaknesses: Slow acceleration and weak on smooth surfaces\nPersonality: Reckless scavenger bot with a punk-rock glitch`,
  },
  {
    name: 'ZO',
    image: '/racers/zosi.png',
    backstory: `Alignment: Neutral Evil\nSpecialty: Wet tracks and rain-slicked surfaces\nStrengths: Hydro-adaptive chassis, smooth traction in storms\nWeaknesses: Vulnerable to overheating and arid climates\nPersonality: Elegant but deceitful, runs slick cons even mid-race`,
  },
  {
    name: 'IGNIS VYRE',
    image: '/racers/ignis-vyre.png',
    backstory: `Alignment: Chaotic Good\nSpecialty: Volcanic and high-temperature circuits\nStrengths: Turbo boosts in extreme heat, fireproof systems\nWeaknesses: Underperforms in cold, icy conditions\nPersonality: Brash and flamboyant, races for rebellion and pride`,
  },
  {
    name: 'Blizzard.EXE',
    image: '/racers/blizzard.png',
    backstory: `Alignment: Lawful Neutral\nSpecialty: Snow-covered, icy terrain\nStrengths: Adaptive temperature systems, excels on ice\nWeaknesses: Struggles in hot or humid environments\nPersonality: Reserved and cool-headed, calculates every move`,
  },
  {
    name: 'VENOMA',
    image: '/racers/venoma.png',
    backstory: `Alignment: Neutral Evil\nSpecialty: Toxic waste zones and biohazardous circuits\nStrengths: Immune to corrosive elements, thrives in pollution\nWeaknesses: Breaks down in sterile or clean environments\nPersonality: Seductive and venomous—ambush racer and saboteur`,
  },
  {
    name: 'SPARK',
    image: '/racers/spark.png',
    backstory: `Alignment: Chaotic Neutral\nSpecialty: High-speed straightaways and unpredictable weather\nStrengths: Voltage-charged acceleration in unstable conditions\nWeaknesses: Loses control on tight, twisty tracks\nPersonality: Thrill-seeker AI with a thirst for speed and glory`,
  },
  {
    name: 'ECLIPSE.9',
    image: '/racers/eclipse9.png',
    backstory: `Alignment: True Evil\nSpecialty: Night races, blackout circuits\nStrengths: Operates silently in total darkness, stealth tech\nWeaknesses: Disoriented in daylight or high-light environments\nPersonality: Shadowy tactician, races to eliminate rivals permanently`,
  },
];

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="w-full text-center text-5xl md:text-7xl font-extrabold tracking-tight lightning-text">
          PUNKRACERZ
        </h1>
        <div className="w-16 md:w-20">
          <Image src="/logo.png" alt="PunkRacerz Logo" width={80} height={80} />
        </div>
      </div>

      {/* Hero Section - Racers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {racers.map((racer, index) => (
          <div
            key={racer.name}
            className={`bg-gray-900 rounded-xl shadow-lg hover:shadow-purple-500/50 p-4 transition duration-300 transform ${openIndex === index ? 'glitch-effect scale-105' : ''}`}
          >
            <Image
              src={racer.image}
              alt={racer.name}
              width={768}
              height={1152}
              className="rounded-lg cursor-pointer"
              onClick={() => toggleDropdown(index)}
            />
            <h2 className="mt-2 text-xl font-bold text-center">{racer.name}</h2>
            {openIndex === index && (
              <pre className="mt-4 text-sm text-white bg-gradient-to-br from-purple-900 to-black p-4 rounded-xl border border-pink-500 shadow-xl font-mono tracking-tight">
                {racer.backstory}
              </pre>
            )}
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
        .glitch-effect {
          animation: glitch 0.3s infinite;
        }
        @keyframes glitch {
          0% {
            transform: translate(0px);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-1px, 1px);
          }
          80% {
            transform: translate(1px, -1px);
          }
          100% {
            transform: translate(0px);
          }
        }
      `}</style>
    </div>
  );
}
