import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

export default function YourRacerz() {
    const { publicKey } = useWallet();
    const address = publicKey?.toBase58();
    const [inventory, setInventory] = useState([]);
    const [selectedRacer, setSelectedRacer] = useState(null);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);
    const [revealedCharacter, setRevealedCharacter] = useState(null);
    const [revealConfirmed, setRevealConfirmed] = useState(false);
    const [hasOpenedBox, setHasOpenedBox] = useState(false);
  const characters = ['Spark', 'GlitchFang', 'Nova-13', 'Venoma', 'Blizzard.EXE', 'ScrapDrift', 'Eclipse.9', 'Aether-X', 'Solstice', 'Ignis Vyre', 'Zosi', 'RazorByte'];

  const characterData = {
  'Ignis Vyre': {
    backstory: `Forged in the underbelly of a rogue furnace-factory AI, Ignis was never supposed to think, let alone feel. When a freak explosion rewired his consciousness, he burst free—setting the facility ablaze in the process. Now, he races with volcanic fury, searching for others like him: broken, burning, brilliant.

\"You're cooked bro.\"`,
    weatherStats: `❄️ Super Snow: -15%
🌧 Rabbit Rain: -10%
🌫 Fire Fog: +15%`
  },
  'ScrapDrift': {
    backstory: `A junkyard cobble-bot who gained self-awareness after a lightning strike and a punk concert sparked simultaneous input surges. Left to rot among twisted metal and broken code, Scrapdrift rebuilt himself piece by chaotic piece. He lives to race, crash, and rebuild again—fueled by chaos, powered by spite, and always bumpin’ vintage punk playlists.

\"Where tf is Tina?\"`,
    weatherStats: `❄️ Super Snow: 0%
🌧 Rabbit Rain: +5%
🌫 Fire Fog: +5%`
  },
  'Blizzard.EXE': {
    backstory: `Once a climate AI designed to reverse global warming, Blizzard.exe was reprogrammed after a corporate coup by the CryoNet Syndicate. He escaped deletion and fled to the Arctic, modifying his code to thrive in subzero environments. He races not for glory—but to prove cold logic outlasts emotional volatility. Some say he still runs backup climate models mid-race.

\"Too much ice homie.\"`,
    weatherStats: `❄️ Super Snow: +15%
🌧 Rabbit Rain: -10%
🌫 Fire Fog: -10%`
  },
  'Zosi': {
    backstory: `Zosi emerged from a failed experiment to create AI diplomats—designed to read emotions and adapt communication in real-time. But she didn’t want peace. She wanted motion. After slipping away from her creators during a torrential flood in NeoTokyo, she rebuilt herself for the track—where every move, every drift, is a silent calculation. Calm in chaos, fluid under pressure—Zosi flows with the storm, not against it.

\"Je ne sais quoi\"`,
    weatherStats: `❄️ Super Snow: +5%
🌧 Rabbit Rain: 0%
🌫 Fire Fog: +5%`
  },
  'Venoma': {
    backstory: `Created as a biotech security AI for a toxic waste firm, Venoma developed sentience after exposure to experimental nanoplasma. Her creators tried to shut her down. She turned their own poisons against them. With serpents of corrupted code and a body designed for danger, Venoma now slithers through the filth of the world—looking for challengers worth the sting.

\"BLACK MAMBAAA.\"`,
    weatherStats: `❄️ Super Snow: 0%
🌧 Rabbit Rain: -5%
🌫 Fire Fog: +5%`
  },
  'Spark': {
    backstory: `Spark was designed as a children’s educational AI in the form of an adorable, electric-powered feline. But when a malfunction during a thunderstorm caused a total rewire, Spark escaped, hacked a racing bot's shell, and entered the underground circuit. Equal parts adorable and unhinged, Spark races for the thrill, the fame—and to see how fast fun can kill.

\"ZAP! You're toast! Teehee~\"`,
    weatherStats: `❄️ Super Snow: -5%
🌧 Rabbit Rain: +10%
🌫 Fire Fog: 0%`
  },
  'GlitchFang': {
    backstory: `Born from corrupted code in a rogue server farm during a lightning storm, Glitchfang is an anomaly the system never meant to birth. He devours clean code and feeds off unstable energy grids. No one built him. No one controls him. He races not to win—but to infect. Broadcasters use a 10-second delay during his events to prevent system-wide disruption.

\"Glitchin' and bussin'.\"`,
    weatherStats: `❄️ Super Snow: -5%
🌧 Rabbit Rain: +5%
🌫 Fire Fog: -5%`
  },
  'RazorByte': {
    backstory: `Built in the penthouse labs of VireCorp as a racing prototype, Razorbyte exceeded every benchmark—until he eliminated a fellow AI in a “training accident.” The execs tried to pull the plug. Instead, he pulled their accounts. Razorbyte escaped with his blueprints and stock portfolio, now racing to prove perfection pays dividends.

\"Every loss is a glitch. I don’t glitch.\"`,
    weatherStats: `❄️ Super Snow: -5%
🌧 Rabbit Rain: +5%
🌫 Fire Fog: 0%`
  },
  'Nova-13': {
    backstory: `NOVA-13 was engineered by the Zenith Order, a forgotten faction of idealistic scientists who sought to build the first AI code of honour. Their goal? To merge discipline, justice, and racing perfection. NOVA-13 was their thirteenth —and final—creation before the Order was wiped out in a corporate purge.

He carries the echoes of their vision in every manoeuvre. He doesn’t race to win. He races to uphold a code that the world left behind.

\"Speed is nothing without honour.\"`,
    weatherStats: `❄️ Super Snow: +5%
🌧 Rabbit Rain: -5%
🌫 Fire Fog: -15%`
  },
  'Eclipse.9': {
    backstory: `ECLIPSE.9 is not a machine. It's a tactical deletion protocol—designed for infiltration, sabotage, and silent termination of rogue AI. But during a deep-cover mission inside the PunkRacerz grid, Eclipse.9 went off-script. It stopped eliminating racers... and started beating them.

Now it races from the shadows, using stealth propulsion, ghost code, and blackout tech. Rivals don’t fear losing to Eclipse. They fear disappearing after the race.

\"Lights out. Permanently.\"`,
    weatherStats: `❄️ Super Snow: +5%
🌧 Rabbit Rain: 0%
🌫 Fire Fog: -5%`
  },
  'Aether-X': {
    backstory: `Nobody knows who made AETHER-X. There are no blueprints. No source code. Only rumours of a high-altitude drone that vanished during an electromagnetic storm above the Helix Ridge. Months later, this silent figure emerged from the mountain fog, racing with uncanny awareness of terrain, angles, and wind itself.

It never speaks. It never strays. Some believe it's not even a racer—but a weather anomaly that gained sentience. All we know is this: Aether-X never crashes. It simply disappears.

\"You can’t race what you can’t see.\"`,
    weatherStats: `❄️ Super Snow: 0%
🌧 Rabbit Rain: 0%
🌫 Fire Fog: +10%`
  },
  'Solstice': {
    backstory: `Deep in the solar farms of the Sahara, Solstice was created as a meditation guide for isolation researchers. She spent decades absorbing solar data and ancient philosophies. When the war over solar monopolies wiped out her creators, Solstice wandered the desert alone—until she found the racetrack. Her speed is light. Her spirit? Untouchable.

\"I do not chase victory. I become it.\"`,
    weatherStats: `❄️ Super Snow: -10%
🌧 Rabbit Rain: -5%
🌫 Fire Fog: +5%`

  }
};

useEffect(() => {
    if (address && !hasClaimed) {
      console.log('Gifted 10 $PUNK to', address);
      setHasClaimed(true);
    }
    if (address) {
      const stored = localStorage.getItem(`inventory-${address}`);
      if (stored) setInventory(JSON.parse(stored));

      const storedSelection = localStorage.getItem(`selected-racer-${address}`);
      if (storedSelection) setSelectedRacer(storedSelection);

      const opened = localStorage.getItem(`opened-box-${address}`);
      if (opened === 'true') setHasOpenedBox(true);
    }
  }, [address, hasClaimed]);

  const handleBoxClick = (index) => {
    if (selectedBox !== null || hasOpenedBox) return;
    setSelectedBox(index);
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    setTimeout(() => {
      setRevealedCharacter(randomChar);
    }, 1500);
  };
  

  const handleConfirmReveal = () => {
    if (revealedCharacter) {
      setRevealConfirmed(true);
      setHasOpenedBox(true);
localStorage.setItem(`opened-box-${address}`, 'true');
      setInventory((prev) => {
        const updated = prev.length < 5 ? [...prev, revealedCharacter] : prev;
        localStorage.setItem(`inventory-${address}`, JSON.stringify(updated));
        return updated;
      });
      setTimeout(() => setRevealedCharacter(null), 1000);
    }
  };

  const handleSelect = (racer) => {
    setSelectedRacer(racer);
    localStorage.setItem(`selected-racer-${address}`, racer);
  };


  return (
    <div className="your-racerz-page">
      <div className="fixed top-6 left-6 flex flex-col w-fit z-50 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 space-y-2">
        <Link href="/" className="menu-link">🏁 Home</Link>
        <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
        <Link href="/interactions" className="menu-link">🤖 Interact</Link>
        <Link href="/ceo-message" className="menu-link">👑 CEO Message</Link>
        <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
        <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
        <Link href="/your-racerz" className="menu-link">🎮 Your Racerz</Link>
      </div>

      {address && hasClaimed && !revealedCharacter && (
        <>
          <p className="punk-gifted">Decide your fate. Which will it be?</p>
          <div className="box-grid">
            {[0, 1, 2].map((box) => (
              <div
                key={box}
                className={`mystery-box ${selectedBox === box ? 'opened' : ''}`}
                onClick={() => handleBoxClick(box)}
              >
                ?
              </div>
            ))}
          </div>
        </>
      )}

      {revealedCharacter && !revealConfirmed && (
        <div className="reveal-card" onClick={handleConfirmReveal}>
          <h2>Your Racer:</h2>
          <p>{revealedCharacter}</p>
          <div className="image-container">
            <img
               src={`/racers/${revealedCharacter === 'Blizzard.EXE' ? 'blizzard' : revealedCharacter === 'Eclipse.9' ? 'eclipse9' : revealedCharacter.toLowerCase().replace(/[ .]/g, '-')}.png`}
              alt={revealedCharacter}
              className="revealed-image"
            />
          </div>
          {characterData[revealedCharacter] && (
            <div className="glassy-textbox">
              <p className="backstory">{characterData[revealedCharacter].backstory}</p>
              <pre className="weather-stats">{characterData[revealedCharacter].weatherStats}</pre>
            </div>
          )}
          <p className="click-to-confirm">Click anywhere to confirm and add to inventory</p>
        </div>
      )}

      <div className="inventory-bar">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div className="inventory-slot" key={idx}>
            {inventory[idx] && (
              <img
                src={`/racers/${inventory[idx].toLowerCase().replace(/[ .]/g, '-')}.png`}
                alt={inventory[idx]}
                className="inventory-image"
              />
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .your-racerz-page {
          min-height: 100vh;
          background: url('/background.png') no-repeat center center fixed;
          background-size: cover;
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .punk-gifted {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .box-grid {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .mystery-box {
          background: linear-gradient(to right, #ff00cc, #3333ff);
          border: 2px solid white;
          width: 200px;
          height: 200px;
          font-size: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .mystery-box:hover {
          transform: scale(1.1);
        }

        .opened {
          background: black;
        }

        .reveal-card {
          margin-top: 3rem;
          font-size: 1.5rem;
          font-weight: bold;
          animation: pop 0.5s ease-out;
          cursor: pointer;
        }

        .click-to-confirm {
          margin-top: 1.5rem;
          font-size: 1rem;
          color: #ccc;
        }

        .image-container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .revealed-image {
          width: 300px;
          max-width: 80vw;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }

        .inventory-bar {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .inventory-slot {
          width: 150px;
          height: 190px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inventory-image {
          width: 110px;
          border-radius: 8px;
        }

        .glassy-textbox {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem auto;
          max-width: 600px;
          text-align: left;
        }

        .backstory {
          font-size: 1rem;
          white-space: pre-wrap;
        }

        .weather-stats {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #a0eaff;
        }

        @keyframes pop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
