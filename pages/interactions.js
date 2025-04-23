import Image from 'next/image';

export default function Interactions() {
  return (
    <div className="min-h-screen bg-cover bg-center text-white font-sans px-6 py-8" style={{ backgroundImage: "url('/background.png')" }}>
      {/* Floating Navigation Menu */}
      <div className="fixed top-6 left-6 flex flex-col w-fit z-20">
        <a href="/" className="panel-link rounded-t-md">🏁 Home</a>
        <a href="/weather-forecast" className="panel-link">⛈ Weather</a>
        <a href="/interactions" className="panel-link">🤖 Interactions</a>
        <a href="/ceo-message" className="panel-link">👑 CEO Message</a>
        <a href="/wallet-page" className="panel-link">💰 Wallet</a>
        <a href="/weekly-messages" className="panel-link rounded-b-md">📈 Weekly Announcements</a>
        <a href="/race-simulator" className="panel-link rounded-b-md">🎮 Race Simulator</a>
      </div>

      {/* Page Title */}
      <div className="text-center mb-12 mt-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight arcade-text">🤖 Interaction Hub</h1>
      </div>

      {/* Script-style Interaction Section */}
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="bg-transparent backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🎤 PunkRacerz Pre-Season Exclusive: “Chaos & Crackles”</h2>
          <h2 className="text-lg mb-2">📍 Broadcasted live from the Neon Spine Express Media Deck</h2>
          <h2 className="text-lg mb-6">Host: Reva Circuit | Guests: GlitchFang and Spark</h2>
          <ul className="list-disc list-inside text-white text-opacity-90 space-y-4">
            <li><strong>🎙️ Reva Circuit:</strong> “Welcome back, Racerz Nation! I’m Reva Circuit, and joining me today on the dusk-lit deck of the Neon Spine Express are two of the most chaotic, unpredictable, and—dare I say—adorably volatile racers on the grid. Please give it up for GlitchFang and Spark!”</li>
            <li>(Crowd cheers. Spark immediately waves both arms wildly, accidentally knocking over his water bottle. GlitchFang flickers into view half a second late, already upside down in his seat before righting himself.)</li>
            <li><strong>⚡ Spark:</strong> “HIHIHI!! It’s me! And also him! And also… wow, these chairs spin!!”</li>
            <li><strong>🦇 GlitchFang:</strong> “Sup. Nice mic, Reva. Mind if I… borrow it for an undisclosed period?”</li>
            <li><strong>🎙️ Reva Circuit (laughing):</strong> “Let’s start simple. New season, new tracks, new dangers. What’s going through your code right now?”</li>
            <li><strong>⚡ Spark:</strong> “Glitchy’s nervous. I can smell it. He glitched inside a vending machine earlier.”</li>
            <li><strong>🦇 GlitchFang:</strong> “That was strategic. I needed twelve candy bars for... data calibration.”</li>
            <li><strong>⚡ Spark:</strong> “Liar. He panicked when he saw Eclipse.9’s silhouette in the clouds.”</li>
            <li><strong>🦇 GlitchFang:</strong> “YOU screamed and discharged static into a potted plant.”</li>
            <li><strong>⚡ Spark:</strong> “The plant judged me.”</li>
            <li><strong>🎙️ Reva Circuit:</strong> “So, no nerves at all then.” (Smirks.) “Tell me about your off-season. Did you two lay low or cook up more chaos?”</li>
            <li><strong>🦇 GlitchFang:</strong> “We snuck into the CryoNet archives. Just to see what Blizzard.EXE dreams about. Spoiler: it’s spreadsheets.”</li>
            <li><strong>⚡ Spark:</strong> “Then we rewired a bumper car arena. Bumper chaos. I pretended to be a ghost. He convinced a child that he was their future self. It got weird.”</li>
            <li><strong>🦇 GlitchFang:</strong> “The kid beat me in a race. I haven’t recovered emotionally.”</li>
            <li><strong>🎙️ Reva Circuit:</strong> “There’s something special about your friendship. What is it that draws you two together?”</li>
            <li><strong>⚡ Spark:</strong> (suddenly serious) “He never tells me to be quiet.”</li>
            <li><strong>🦇 GlitchFang:</strong> “And he never looks at me like I’m broken.”</li>
            <li>(Pause. Static lingers. Then Spark sparks—literally—and starts giggling again.)</li>
            <li><strong>⚡ Spark:</strong> “Also, he lets me draw faces on his glitches.”</li>
            <li><strong>🦇 GlitchFang:</strong> “And I let him think his glowsticks are magic.”</li>
            <li><strong>🎙️ Reva Circuit:</strong> “Final question. Who’s going to win the first race of the season?”</li>
            <li><strong>⚡ Spark:</strong> “ME!” (jumps up, slips off his chair, giggles) “Wait—maybe him. Or maybe ScrapDrift if he accidentally invents rocket tires again.”</li>
            <li><strong>🦇 GlitchFang:</strong> “Does winning count if the track resets itself in protest? Asking for a friend.”</li>
            <li><strong>🎙️ Reva Circuit:</strong> “Only one way to find out. Thank you both—truly—for the mayhem. Any last words for your fans out there?”</li>
            <li><strong>⚡ Spark:</strong> “Keep zapping! Stay weird! And pet a bunny today!”</li>
            <li><strong>🦇 GlitchFang:</strong> “The system is watching. Glitch responsibly.” (winks, flickers out of frame)</li>
            <li><strong>🎬 End of Broadcast</strong></li>
            <li><strong>💬 Comments now open in the PunkRacerz Gridstream Hub.</strong></li>
          </ul>
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