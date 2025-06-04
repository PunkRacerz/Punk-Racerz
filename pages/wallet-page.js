import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import Image from 'next/image';
import Link from 'next/link';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const wallets = [new PhantomWalletAdapter()];

function WalletPageContent() {
  const wallet = useWallet();
  const [tokens, setTokens] = useState(0);
  const [betHistory, setBetHistory] = useState([]);
  const [singleBet, setSingleBet] = useState(null);

  useEffect(() => {
    if (wallet?.publicKey) {
      const storedTokens = localStorage.getItem(`tokens-${wallet.publicKey}`);
      const storedBets = localStorage.getItem(`bets-${wallet.publicKey}`);
      const storedSingle = localStorage.getItem('punkxBet');
  
      if (storedTokens) setTokens(Number(storedTokens));
      if (storedBets) setBetHistory(JSON.parse(storedBets));
      if (storedSingle) setSingleBet(JSON.parse(storedSingle));
    } else {
      setTokens(0);
      setBetHistory([]);
      setSingleBet(null);
    }
  }, [wallet?.publicKey]);
  
  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-0" style={{ backgroundImage: "url('/background2.png')" }}>
      {/* Menu */}
      <div className="w-full p-4 bg-black/30 backdrop-blur-md text-white flex justify-center gap-6 text-sm font-medium border-b border-pink-500 shadow-md">
        <Link href="/">🏁 Home</Link>
        <Link href="/your-racerz">🎮 Inventory</Link>
        <Link href="/punkx">PunkX</Link>
        <Link href="/weather-forecast">⛈ Weather</Link>
        <Link href="/interactions">🤖 Interact</Link>
        <Link href="/wallet-page">💰 Wallet</Link>
        <Link href="/weekly-messages">📈 Weekly Announcements</Link>
        <Link href="/race-simulator">🎮 Race Simulator</Link>
      </div>

      {/* Page Content */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="w-full text-center text-4xl md:text-6xl font-extrabold tracking-tight arcade-text">
          YOUR WALLET
        </h1>
        <div className="w-16 md:w-20">
          <Image src="/logo.png" alt="PunkRacerz Logo" width={80} height={80} />
        </div>
      </div>

      <div className="text-center mb-6 text-lg">
        <p><strong>Wallet Address:</strong> {wallet?.publicKey?.toBase58() || 'Not Connected'}</p>
        <p><strong>$PUNK Tokens:</strong> {tokens}</p>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">🎯 Current Active Bet</h2>
        {singleBet ? (
          <div className="bg-pink-900 bg-opacity-50 p-4 rounded-xl inline-block text-white">
            <p>You have bet <strong>{singleBet.amount.toLocaleString()} $PUNK</strong> on:</p>
            <p className="text-green-400 font-bold text-lg mt-2">{singleBet.racer}</p>
          </div>
        ) : (
          <p className="text-gray-400">No active bet recorded.</p>
        )}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">📜 Bet History</h2>
        {betHistory.length > 0 ? (
          <ul className="text-sm space-y-4 flex flex-col items-center">
            {betHistory.map((entry, i) => (
              <li
                key={i}
                className="bg-purple-800 bg-opacity-60 text-white p-4 rounded-xl max-w-md w-full text-left"
              >
                <div>🐎 Bet on <strong>{entry.name}</strong> @ <strong>{entry.odds}</strong>x</div>
                <div>🕒 Time: {entry.timestamp}</div>
                <div className="text-yellow-400 font-bold">
                  🎯 Expected Payout: {(10 * parseFloat(entry.odds)).toFixed(2)} $PUNK
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No bets placed yet.</p>
        )}
      </div>

      <div className="mt-10 text-center">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
      </div>
    </div>
  );
}

// ✅ Export this so Next.js recognizes it as a page
export default function WalletPage() {
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletPageContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
