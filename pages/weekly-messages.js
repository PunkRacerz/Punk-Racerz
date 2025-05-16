import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function WeeklyAnnouncements() {
  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8" style={{ backgroundImage: "url('/background.png')" }}>
      {/* Navigation Menu */}
    <div className="your-racerz-page">
      <div className="fixed top-6 left-6 flex flex-col w-fit z-50 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 space-y-2">
  <Link href="/" className="menu-link">🏁 Home</Link>
  <Link href="/your-racerz" className="menu-link">🎮 Inventory</Link>
  <Link href="/weather-forecast" className="menu-link">⛈ Weather</Link>
  <Link href="/interactions" className="menu-link">🤖 Interact</Link>
  <Link href="/wallet-page" className="menu-link">💰 Wallet</Link>
  <Link href="/weekly-messages" className="menu-link">📈 Weekly Announcements</Link>
  <Link href="/race-simulator" className="menu-link">🎮 Race Simulator</Link>
      </div>
  
</div>

      {/* Announcements Section */}
      <motion.div className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-center text-5xl md:text-6xl font-bold mb-16 text-white tracking-wider" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          📈 Weekly Announcements
        </h1>

        {/* Example Announcement */}
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            className="p-6 mb-10 rounded-3xl bg-transparent backdrop-blur-xl shadow-2xl border border-white border-opacity-20 transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Share Tech Mono, monospace' }}>🏎️ Race Update</h2>
            <p className="text-lg leading-relaxed">
              PunkRacerz just completed its wildest race yet! Spark accidentally started a bunny avalanche, GlitchFang teleported into a billboard, and Venoma poisoned the water coolers (again). Stay tuned for the new *Rocket League-style Nitro Update* dropping soon!
            </p>
          </motion.div>

          <motion.div
            className="p-6 mb-10 rounded-3xl bg-transparent backdrop-blur-xl shadow-2xl border border-white border-opacity-20 transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Share Tech Mono, monospace' }}>🔥 Upcoming Tournament</h2>
            <p className="text-lg leading-relaxed">
              🚨 ANNOUNCEMENT: Neon Spine Express will host the *first* PunkRacerz Weekly Tournament!  
              Bet SOL, win custom NFTs, and unlock legendary car skins.  
              Registration opens this Friday — limited spots available!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        .panel-link {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-weight: bold;
          text-align: left;
          transition: all 0.2s ease-in-out;
        }
        .panel-link:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
