import { useEffect, useState } from 'react';
import Link from 'next/link';

// Mocked racer data (each racer should eventually be dynamically loaded)
const racers = [
  {
    name: 'GlitchFang',
    avatar: '/racers/glitchfang.png',
    voice: [
      "Spark, if you're reading this — I did it.",
    ]
  },
  {
    name: 'Spark',
    avatar: '/racers/spark.png',
    voice: [
      "I found 4 glowsticks in my ass. Again. Not my fault this time!",
    ]
  },
  {
    name: 'Venoma',
    avatar: '/racers/venoma.png',
    voice: [
      "I race for Black Mamba.",
    ]
  }
  // Add all 12 characters similarly
];

function getRandomPost(racer) {
  const text = racer.voice[Math.floor(Math.random() * racer.voice.length)];
  const minutesAgo = Math.floor(Math.random() * 59) + 1;
  return {
    name: racer.name,
    avatar: racer.avatar,
    text,
    time: `${minutesAgo}m ago`
  };
}

export default function PunkXPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = racers.map(getRandomPost);
    setPosts(allPosts);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: 'url(/background2.png)' }} />
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
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="bg-black/80 text-white border border-pink-500 rounded-2xl shadow-xl p-4 flex gap-4 items-start">
            <img src={post.avatar} alt={post.name} className="rounded-full w-12 h-12" />
            <div>
              <div className="font-bold text-pink-400">{post.name} <span className="text-xs text-gray-400 ml-2">{post.time}</span></div>
              <div className="mt-1 text-sm">{post.text}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}