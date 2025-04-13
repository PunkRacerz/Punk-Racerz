import Image from 'next/image';
import { useState } from 'react';

const racers = [
  // [Racer data remains unchanged]
];

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

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

      {/* Hero Section - Racers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {racers.map((racer, index) => (
          <div
            key={racer.name}
            onClick={() => toggleDropdown(index)}
            className={`bg-gray-900/80 rounded-xl shadow-lg hover:shadow-pink-500/50 p-3 transition-transform duration-200 cursor-pointer ${
              openIndex === index ? 'animate-glitch-once scale-105' : ''
            }`}
          >
            <Image
              src={racer.image}
              alt={racer.name}
              width={300}
              height={450}
              className="rounded-lg mx-auto"
            />
            <h2 className="mt-2 text-lg font-bold text-center">{racer.name}</h2>
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

        @keyframes glitch-once {
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

        .animate-glitch-once {
          animation: glitch-once 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
