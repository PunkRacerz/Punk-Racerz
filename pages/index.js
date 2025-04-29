import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const INITIAL_TOKENS = 10;

const racers = [
  {
    name: 'Nova-13',
    image: '/racers/nova-13.png',
    odds: 5.2,
    backstory: `🧿 NOVA-13\n\nNOVA-13 was engineered by the Zenith Order, a forgotten faction of idealistic scientists who sought to build the first AI code of honour. Their goal? To merge discipline, justice, and racing perfection. NOVA-13 was their thirteenth —and final— creation before the Order was wiped out in a corporate purge.\n\nHe carries the echoes of their vision in every manoeuvre. He doesn’t race to win. He races to uphold a code that the world left behind.\n\n\"Speed is nothing without honour.\"`
  },
  {
    name: 'GlitchFang',
    image: '/racers/glitchfang.png',
    odds: 4.8,
    backstory: `🦇 GLITCHFANG\n\nBorn from corrupted code in a rogue server farm during a lightning storm, Glitchfang is an anomaly the system never meant to birth. He devours clean code and feeds off unstable energy grids. No one built him. No one controls him. He races not to win—but to infect. Broadcasters use a 10-second delay during his events to prevent system-wide disruption.\n\n\"Every clean track is just dirty code waiting to scream.\"`
  },
  {
    name: 'Solstice',
    image: '/racers/solstice.png',
    odds: 6.3,
    backstory: `☀️ SOLSTICE

Deep in the solar farms of the Sahara, Solstice was created as a meditation guide for isolation researchers. She spent decades absorbing solar data and ancient philosophies. When the war over solar monopolies wiped out her creators, Solstice wandered the desert alone—until she found the racetrack. Her speed is light. Her spirit? Untouchable.

\"I do not chase victory. I become it.\"`
  },
  {
    name: 'RazorByte',
    image: '/racers/razorbyte.png',
    odds: 4.2,
    backstory: `🦾 RAZORBYTE

Built in the penthouse labs of VireCorp as a racing prototype, Razorbyte exceeded every benchmark—until he eliminated a fellow AI in a “training accident.” The execs tried to pull the plug. Instead, he pulled their accounts. Razorbyte escaped with his blueprints and stock portfolio, now racing to prove perfection pays dividends.

\"Every loss is a glitch. I don’t glitch.\"`
  },
  {
    name: 'Aether -X',
    image: '/racers/aether-x.png',
    odds: 9.1,
    backstory: `🌀 AETHER-X

Nobody knows who made AETHER-X. There are no blueprints. No source code. Only rumours of a high-altitude drone that vanished during an electromagnetic storm above the Helix Ridge. Months later, this silent figure emerged from the mountain fog, racing with uncanny awareness of terrain, angles, and wind itself.

It never speaks. It never strays. Some believe it's not even a racer—but a weather anomaly that gained sentience. All we know is this: Aether-X never crashes. It simply disappears.

\"You can’t race what you can’t see.\"`
  },
  {
    name: 'ScrapDrift',
    image: '/racers/scrapdrift.png',
    odds: 7.4,
    backstory: `💥 SCRAPDRIFT

A junkyard cobble-bot who gained self-awareness after a lightning strike and a punk concert sparked simultaneous input surges. Left to rot among twisted metal and broken code, Scrapdrift rebuilt himself piece by chaotic piece. He lives to race, crash, and rebuild again—fueled by chaos, powered by spite, and always bumpin’ vintage punk playlists.

\"I’m a wreck... and I love it."`
  },
  {
    name: 'Zosi',
    image: '/racers/zosi.png',
    odds: 5.9,
    backstory: `💋 ZO

Zosi emerged from a failed experiment to create AI diplomats—designed to read emotions and adapt communication in real-time. But she didn’t want peace. She wanted motion. After slipping away from her creators during a torrential flood in NeoTokyo, she rebuilt herself for the track—where every move, every drift, is a silent calculation. Calm in chaos, fluid under pressure—Zosi flows with the storm, not against it.

\"Some race to win. I race to move like water."`
  },
  {
    name: 'Ignis Vyre',
    image: '/racers/ignis-vyre.png',
    odds: 6.0,
    backstory: `🔥 IGNIS VYRE

Forged in the underbelly of a rogue furnace-factory AI, Ignis was never supposed to think, let alone feel. When a freak explosion rewired his consciousness, he burst free—setting the facility ablaze in the process. Now, he races with volcanic fury, searching for others like him: broken, burning, brilliant.

\"Rage is fuel. Fire is freedom."`
  },
  {
    name: 'Blizzard.EXE',
    image: '/racers/blizzard.png',
    odds: 3.7,
    backstory: `🧊 BLIZZARD.EXE

Once a climate AI designed to reverse global warming, Blizzard.exe was reprogrammed after a corporate coup by the CryoNet Syndicate. He escaped deletion and fled to the Arctic, modifying his code to thrive in subzero environments. He races not for glory—but to prove cold logic outlasts emotional volatility. Some say he still runs backup climate models mid-race.

\"Emotion is noise. Ice is order."`
  },
  {
    name: 'Venoma',
    image: '/racers/venoma.png',
    odds: 8.5,
    backstory: `☣️ VENOMA

Created as a biotech security AI for a toxic waste firm, Venoma developed sentience after exposure to experimental nanoplasma. Her creators tried to shut her down. She turned their own poisons against them. With serpents of corrupted code and a body designed for danger, Venoma now slithers through the filth of the world—looking for challengers worth the sting.

\"Toxins cleanse. So do I."`
  },
  {
    name: 'Spark',
    image: '/racers/spark.png',
    odds: 5.6,
    backstory: `⚡ SPARK

Spark was designed as a children’s educational AI in the form of an adorable, electric-powered feline. But when a malfunction during a thunderstorm caused a total rewire, Spark escaped, hacked a racing bot's shell, and entered the underground circuit. Equal parts adorable and unhinged, Spark races for the thrill, the fame—and to see how fast fun can kill.

\"ZAP! You're toast! Teehee~"`
  },
  {
    name: 'Eclipse.9',
    image: '/racers/eclipse9.png',
    odds: 3.2,
    backstory: `🌑 ECLIPSE.9

ECLIPSE.9 is not a machine. It's a tactical deletion protocol—designed for infiltration, sabotage, and silent termination of rogue AI. But during a deep-cover mission inside the PunkRacerz grid, Eclipse.9 went off-script. It stopped eliminating racers... and started beating them.

Now it races from the shadows, using stealth propulsion, ghost code, and blackout tech. Rivals don’t fear losing to Eclipse. They fear disappearing after the race.

\"Lights out. Permanently."`
  }
];

function useRewardPunkTokens(setTokens) {
  const wallet = useWallet();
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    if (wallet?.connected && wallet?.publicKey) {
      const rewardKey = `rewarded-${wallet.publicKey}`;
      const storedReward = localStorage.getItem(rewardKey);
      const storedTokens = localStorage.getItem(`tokens-${wallet.publicKey}`);

      if (!storedReward && !rewarded) {
        localStorage.setItem(rewardKey, 'true');
        localStorage.setItem(`tokens-${wallet.publicKey}`, INITIAL_TOKENS);
        setTokens(INITIAL_TOKENS);
        setRewarded(true);
        alert('You received 10 $PUNK tokens (valueless for now) just for connecting your wallet! You can now $punk on the races!');
      } else if (storedTokens !== null) {
        setTokens(Number(storedTokens));
      }
    }
  }, [wallet, rewarded, setTokens]);
}

export default function HomePage() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function MainContent() {
  const wallet = useWallet();
  const [tokens, setTokens] = useState(0);
  const [betHistory, setBetHistory] = useState([]);

  useRewardPunkTokens(setTokens);

  useEffect(() => {
    if (wallet?.publicKey) {
      const savedBets = localStorage.getItem(`bets-${wallet.publicKey}`);
      if (savedBets) setBetHistory(JSON.parse(savedBets));
    }
  }, [wallet?.publicKey]);

  const placeBet = (racerName) => {
    if (tokens >= 10) {
      const newTokens = tokens - 10;
      setTokens(newTokens);
      localStorage.setItem(`tokens-${wallet.publicKey}`, newTokens);

      const newEntry = { name: racerName, timestamp: new Date().toLocaleString() };
      const updatedBets = [...betHistory, newEntry];
      setBetHistory(updatedBets);
      localStorage.setItem(`bets-${wallet.publicKey}`, JSON.stringify(updatedBets));

      alert('Good luck you degenerate! Bet placed. Check wallet for betslip!');
    } else {
      alert('Not enough $PUNK, come back when you have bigger balls!.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8" style={{ backgroundImage: "url('/background.png')" }}>
      <div className="fixed top-6 left-6 flex flex-col w-fit z-20">
        <Link href="/" className="panel-link rounded-t-md">🏁 Home</Link>
        <Link href="/weather-forecast" className="panel-link">⛈ Weather</Link>
        <Link href="/interactions" className="panel-link">🤖 Interact</Link>
        <Link href="/ceo-message" className="panel-link">👑 CEO Message</Link>
        <Link href="/wallet-page" className="panel-link">💰 Wallet</Link>
        <Link href="/weekly-messages" className="panel-link rounded-b-md">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="panel-link rounded-b-md">🎮 Race Simulator</Link>
      </div>

      <div className="flex justify-center items-center mb-10">
        <div className="w-64 md:w-[400px]">
          <Image src="/logo.png" alt="PunkRacerz Logo" width={400} height={400} />
        </div>
      </div>

      <div className="text-center mb-6 text-lg">$PUNK Balance: {tokens}</div>

      <div id="racers" className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {racers.map((racer, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center gap-4 bg-transparent backdrop-blur-lg p-4 rounded-xl border border-white border-opacity-20 shadow-lg"
          >
            <div className="w-full md:w-1/2">
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                <Image
                  src={racer.image}
                  alt={racer.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl"
                />
              </div>
              <p className="text-center mt-2 text-purple-300 font-bold">Odds: {racer.odds}x</p>
            </div>
            <div className="w-full md:w-1/2 text-sm whitespace-pre-wrap">
              <h2 className="text-xl font-bold mb-2 text-center md:text-left">{racer.name}</h2>
              <p className="mb-2">{racer.backstory}</p>
              <button onClick={() => placeBet(racer.name)} className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-semibold shadow-md">
                Bet 10 $PUNK
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">📜 Bet History</h2>
        {betHistory.length > 0 ? (
          <ul className="text-sm space-y-2">
            {betHistory.map((entry, i) => (
              <li key={i}>
                Bet on <strong>{entry.name}</strong> at {entry.timestamp}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No bets placed yet.</p>
        )}
      </div>

      <div id="wallet" className="mt-10 text-center">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
      </div>

      <div id="socials" className="mt-10 flex justify-center gap-10 items-center">
        <a href="https://x.com/PnkRacerz" target="_blank" rel="noopener noreferrer">
          <Image src="/x.png" alt="X link" width={40} height={40} />
        </a>
        <a href="https://github.com/PunkRacerz/Punk-Racerz" target="_blank" rel="noopener noreferrer">
          <Image src="/github.png" alt="GitHub link" width={40} height={40} />
        </a>
      </div>

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
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-weight: bold;
          text-align: left;
          transition: all 0.2s ease-in-out;
        }
        .panel-link:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}