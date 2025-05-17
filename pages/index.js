import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const racers = [
  'Spark', 'GlitchFang', 'Nova-13', 'Venoma', 'Blizzard.EXE', 'ScrapDrift',
  'Eclipse.9', 'Aether-X', 'Solstice', 'Ignis Vyre', 'Zosi', 'RazorByte'
];

const RACER_COST = 10;
const MAX_INVENTORY = 5;
const INITIAL_TOKENS = 40;

export default function CharacterShop() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58();
  const [tokens, setTokens] = useState(0);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (address) {
      const tokenKey = `tokens-${address}`;
      const inventoryKey = `inventory-${address}`;
      const rewardedKey = `rewarded-${address}`;

      const storedTokens = localStorage.getItem(tokenKey);
      const storedInventory = localStorage.getItem(inventoryKey);
      const alreadyRewarded = localStorage.getItem(rewardedKey);

      if (!alreadyRewarded) {
        localStorage.setItem(tokenKey, INITIAL_TOKENS);
        localStorage.setItem(rewardedKey, 'true');
        setTokens(INITIAL_TOKENS);
        alert('You received 40 $PUNK tokens for connecting your wallet!');
      } else if (storedTokens !== null) {
        setTokens(parseInt(storedTokens));
      }

      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    }
  }, [address]);

  const handleBuy = (racer) => {
    if (tokens < RACER_COST) return alert("Not enough $PUNK.");
    if (inventory.includes(racer)) return alert("You already own this character.");
    if (inventory.length >= MAX_INVENTORY) return alert("Inventory full. Max 5 characters.");

    const updatedTokens = tokens - RACER_COST;
    const updatedInventory = [...inventory, racer];

    setTokens(updatedTokens);
    setInventory(updatedInventory);
    localStorage.setItem(`tokens-${address}`, updatedTokens);
    localStorage.setItem(`inventory-${address}`, JSON.stringify(updatedInventory));
    alert(`${racer} added to your inventory.`);
  };

  return (
   <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 bg-cover bg-center" style={{ backgroundImage: 'url(/background2.png)' }}></div>
      <nav className="w-full p-4 bg-black/30 backdrop-blur-md text-white flex justify-center gap-6 text-sm font-medium border-b border-pink-500 shadow-md">
      <Link href="/" className="menu-link">🏁 Home</Link>
  <Link href="/your-racerz" className="menu-link">🎮 Inventory</Link>
  <Link href="/punkx">PunkX</Link>
  <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
  <Link href="/interactions" className="menu-link">🤖 Interact</Link>
  <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
  <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
  <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
      </nav>

      <div className="pt-20">
        <div className="text-center mb-4">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
        </div>

        <h1 className="text-3xl text-center mt-6 font-bold text-white">Character Shop</h1>
        <p className="text-center text-white mt-2">$PUNK Balance: {tokens}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
          {racers.map((racer) => {
            const alreadyOwned = inventory.includes(racer);
            return (
              <div key={racer} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center text-white">
                <Image
                  src={`/racers/${racer === 'Blizzard.EXE' ? 'blizzard' : racer === 'Eclipse.9' ? 'eclipse9' : racer.toLowerCase().replace(/[ .]/g, '-')}.png`}
                  alt={racer}
                  width={150}
                  height={150}
                  className="mx-auto rounded"
                />
                <h2 className="mt-2 font-semibold text-lg">{racer}</h2>
                <button
                  onClick={() => handleBuy(racer)}
                  disabled={alreadyOwned}
                  className={`mt-4 px-4 py-2 rounded text-sm font-bold ${alreadyOwned ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {alreadyOwned ? 'Owned' : `Buy for ${RACER_COST} $PUNK`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-10 mt-10">
          <a href="https://x.com/PnkRacerz" target="_blank" rel="noopener noreferrer">
            <Image src="/x.png" alt="X link" width={40} height={40} />
          </a>
          <a href="https://github.com/PunkRacerz/Punk-Racerz/tree/main" target="_blank" rel="noopener noreferrer">
            <Image src="/github.png" alt="GitHub link" width={40} height={40} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .shop-page {
          min-height: 100vh;
          background: url('/background.png') no-repeat center center fixed;
          background-size: cover;
          padding: 0;
        }
      `}</style>
    </>
  );
}

