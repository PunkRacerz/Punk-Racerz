import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

// Odds reference pulled from homepage
const oddsMap = {
  'Nova-13': 5.2,
  'GlitchFang': 4.8,
  'Solstice': 6.3,
  'RazorByte': 4.2,
  'Aether -X': 9.1,
  'ScrapDrift': 7.4,
  'Zosi': 5.9,
  'Ignis Vyre': 6.0,
  'Blizzard.EXE': 3.7,
  'Venoma': 8.5,
  'Spark': 5.6,
  'Eclipse.9': 3.2
};

export default function WalletPageWrapper() {
  const wallets = [new PhantomWalletAdapter()];
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function WalletPage() {
  const wallet = useWallet();
  const [tokens, setTokens] = useState(0);
  const [betHistory, setBetHistory] = useState([]);

  useEffect(() => {
    if (wallet?.publicKey) {
      const storedTokens = localStorage.getItem(`tokens-${wallet.publicKey}`);
      const storedBets = localStorage.getItem(`bets-${wallet.publicKey}`);

      if (storedTokens) setTokens(Number(storedTokens));
      if (storedBets) setBetHistory(JSON.parse(storedBets));
    } else {
      setTokens(0);
      setBetHistory([]);
    }
  }, [wallet?.publicKey]);

  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8" style={{ backgroundImage: "url('/background.png')" }}>
      <div className="fixed top-6 left-6 flex flex-col w-fit z-20">
        <a href="/" className="panel-link rounded-t-md">🏁 Home</a>
        <a href="/weather-forecast" className="panel-link">⛈ Weather</a>
        <a href="/interactions" className="panel-link">🤖 Interact</a>
        <a href="/wallet-page" className="panel-link">💰 Wallet</a>
        <a href="/ceo-message" className="panel-link rounded-b-md">👑 CEO Message</a>
        <a href="/weekly-messages" className="panel-link rounded-b-md">📈 Weekly Messages</a>
      </div>

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
        <h2 className="text-2xl font-bold mb-4">📜 Bet History</h2>
        {betHistory.length > 0 ? (
          <ul className="text-sm space-y-4 flex flex-col items-center">
            {betHistory.map((entry, i) => (
              <li
                key={i}
                className="bg-purple-800 bg-opacity-60 text-white p-4 rounded-xl max-w-md w-full text-left"
              >
                <div>🐎 Bet on <strong>{entry.name}</strong> @ <strong>{entry.odds || oddsMap[entry.name]}x</strong></div>
                <div>🕒 Time: {entry.timestamp}</div>
                <div className="text-yellow-400 font-bold">
                  🎯 Expected Payout: {(10 * (parseFloat(entry.odds) || oddsMap[entry.name])).toFixed(2)} $PUNK
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