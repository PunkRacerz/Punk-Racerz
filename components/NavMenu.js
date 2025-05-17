import Link from 'next/link';

export default function NavMenu() {
  return (
    <div className="fixed top-6 left-6 flex flex-col w-fit z-50 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 space-y-2">
  <Link href="/" className="menu-link">🏁 Home</Link>
  <Link href="/your-racerz" className="menu-link">🎮 Inventory</Link>
  <Link href="/punkx">PunkX</Link>
  <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
  <Link href="/interactions" className="menu-link">🤖 Interact</Link>
  <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
  <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
  <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
      </div>

  );
}
