import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

require('@solana/wallet-adapter-react-ui/styles.css');

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
  }
  {
    name: 'Solstice',
    image: '/racers/solstice.png',
    odds: 6.3,
    backstory: `☀️ SOLSTIC

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
    name: 'Aether-X',
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

export default function HomePage() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
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

            {/* Racer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {racers.map((racer, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center gap-4 bg-black bg-opacity-60 p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
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
                    <Link href={`/bet/${racer.name.toLowerCase()}`}>
                      <button className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-semibold shadow-md">
                        Bet Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Connect Wallet Button */}
            <div className="mt-10 text-center">
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}