import Image from 'next/image';
import { useState } from 'react';

const racers = [
  {
    name: 'Spark',
    image: '/racers/spark.png',
    backstory: `Spark is mischievous but warm-hearted, excitable, and unpredictable. He races for the thrill and the chaos.`,
  },
  {
    name: 'GlitchFang',
    image: '/racers/glitchfang.png',
    backstory: `A glitchy renegade with a hidden sadness, GlitchFang flickers through space and connection, racing to feel alive.`,
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
        <h1 className="w-full text-center text-5xl md:text-7xl font-extrabold tracking-tight neon-text">
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
            className="bg-gray-900 rounded-xl shadow-lg hover:shadow-purple-500/50 p-4 transition duration-300"
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
              <p className="mt-2 text-sm text-purple-200 bg-gray-800 p-3 rounded">
                {racer.backstory}
              </p>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .neon-text {
          color: #e600ff;
          text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #e600ff,
            0 0 80pxrgba(230, 0, 255, 0.71), 0 0 90px #e600ff, 0 0 100px #e600ff;
        }
      `}</style>
    </div>
  );
}