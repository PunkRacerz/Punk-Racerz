
import { useEffect, useState } from "react";
import Link from "next/link";

const neonSpineOdds = {
  "Spark": 5.0,
  "GlitchFang": 8.38,
  "Venoma": 8.65,
  "Eclipse.9": 5.63,
  "Nova-13": 4.0,
  "Solstice": 6.91,
  "Zosi": 6.86,
  "Blizzard.EXE": 6.42,
  "ScrapDrift": 9.96,
  "Razorbyte": 3.5,
  "Aether-X": 7.57,
  "Ignis Vyre": 6.59
};

export default function PunkRacerzApp() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [punkBalance, setPunkBalance] = useState(null);
  const [weatherPreview, setWeatherPreview] = useState([]);
  const [interactions, setInteractions] = useState([]);

  const weatherOptions = [
    "Super Snow", "Rabbit Rain", "Smelting Sunshine",
    "Hazardous Heat", "Cursed Clouds", "Acid Attacks", "Fire Fog"
  ];

  const weatherEffects = {
    "Super Snow": { boost: "Blizzard.EXE", drop: "Ignis Vyre", synopsis: "Snow boosts Blizzard.EXE's systems, but freezes out Ignis Vyre." },
    "Rabbit Rain": { boost: "Zosi", drop: "Solstice", synopsis: "Rain empowers Zosi’s hydro-chassis but slows sun-powered Solstice." },
    "Smelting Sunshine": { boost: "Solstice", drop: "Eclipse.9", synopsis: "Solar power boosts Solstice but disrupts Eclipse.9’s stealth." },
    "Hazardous Heat": { boost: "Ignis Vyre", drop: "Blizzard.EXE", synopsis: "Ignis thrives in heat while Blizzard.EXE's systems overheat." },
    "Cursed Clouds": { boost: "Eclipse.9", drop: "Nova-13", synopsis: "Dark skies give Eclipse.9 an edge, clouding Nova-13’s sensors." },
    "Acid Attacks": { boost: "Venoma", drop: "ScrapDrift", synopsis: "Toxic air fuels Venoma but corrodes ScrapDrift’s components." },
    "Fire Fog": { boost: "Aether-X", drop: "Nova-13", synopsis: "Aether-X vanishes in fog; Nova-13 struggles with visibility." }
  };

  useEffect(() => {
    const shuffled = [...weatherOptions].sort(() => 0.5 - Math.random());
    const forecast = shuffled.slice(0, 3);
    setWeatherPreview(forecast);

    const weatherBoost = weatherEffects[forecast[0]];
    const sampleInteractions = [
      { text: `Weather Boost: ${weatherBoost.boost} +7%, ${weatherBoost.drop} -5%` },
      { text: "Spark pranks GlitchFang with an EMP pie. Spark +5%, GlitchFang -5%" },
      { text: "Venoma releases nano-venom in pit lane. Venoma +4%, others -1%" },
      { text: "Solstice absorbs solar energy. Solstice +3%, Zosi -3%" }
    ];
    setInteractions(sampleInteractions);
  }, []);

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">PUNKRACERZ</h1>
          {walletConnected && (
            <p className="text-xs text-zinc-400">Wallet: {walletAddress} | $PUNK: {punkBalance}</p>
          )}
        </div>
        <button
          onClick={() => alert('Connect Wallet logic goes here')}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl shadow"
        >
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </header>

      <section className="bg-zinc-900 p-6 rounded-2xl shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Forecast Preview</h2>
        <ul className="text-zinc-300 list-disc ml-5">
          {weatherPreview.map((type, idx) => (
            <li key={idx}>
              <span className="text-emerald-300 font-semibold">{type}</span>: {weatherEffects[type].synopsis}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-zinc-500 italic">One of these will shape the track on race day.</p>
        <Link href="/weather-info" className="text-indigo-400 underline mt-2 inline-block">Full Weather Guide →</Link>
      </section>

      <section className="bg-zinc-900 p-6 rounded-2xl shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Racer Interactions</h2>
        <ul className="text-sm space-y-1">
          {interactions.map((item, idx) => (
            <li key={idx} className="text-zinc-300">• {item.text}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
