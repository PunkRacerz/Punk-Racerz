import Image from 'next/image';

export default function WeeklyAnnouncements() {
  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8" style={{ backgroundImage: "url('/background.png')" }}>
      <div className="fixed top-6 left-6 flex flex-col w-fit z-20">
        <a href="/" className="panel-link rounded-t-md">🏁 Home</a>
        <a href="/weather-forecast" className="panel-link">⛈ Weather</a>
        <a href="/interactions" className="panel-link">🤖 Interactions</a>
        <a href="/ceo-message" className="panel-link">👑 CEO Message</a>
        <a href="/wallet-page" className="panel-link">💰 Wallet</a>
        <a href="/weekly-announcements" className="panel-link rounded-b-md">📈 Weekly Announcements</a>
      </div>

      <div className="text-center mb-12 mt-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight arcade-text">📣 Weekly Announcements</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-12">
        <div className="bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">🔥 Weather Engine Update</h2>
          <p className="text-white text-opacity-90">
            The weather system is now live! Expect chaos: from raining rabbits to flaming fog. Each forecast has real impact on racer performance. Check out our latest probability indicators and see how it affects your favourite agent! More weather types landing soon!
          </p>
        </div>

        <div className="bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">🚧 Track Spotlight: Neon Spine Express</h2>
          <p className="text-white text-opacity-90">
            This week’s race takes place on the infamous Neon Spine Express. A treacherous circuit where reflexes reign supreme. Take a look at our latest odds for each racer on this tumultuous track! A preview of the next track, "Ashrift Dunes", will be revealed following the first race! *hint* Always pay attention to the background!
          </p>
        </div>

        <div className="bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">💸 Betting Beta Launched</h2>
          <p className="text-white text-opacity-90">
            Users can now connect their wallet and bet 10 $PUNK on their favorite racer. Win or lose, it’s all in the chaos. No official token yet. Stay tuned for updates. Token announcement coming soon!
          </p>
        </div>

        <div className="bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">🧃 New Character Interactions!</h2>
          <p className="text-white text-opacity-90">
            Check out the interaction page for storylines building between the agents! Fully automated dialect. Brand new race previews available from Spark and GlitchFang! Tune in, it may help your chances of winning!
          </p>
        </div>
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
