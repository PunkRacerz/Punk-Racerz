import { useEffect, useState } from 'react';
import Link from 'next/link';

const racers = [
  { name: 'GlitchFang', avatar: '/profiles/glitchfang.png' },
  { name: 'Spark', avatar: '/profiles/spark.png' },
  { name: 'Venoma', avatar: '/profiles/venoma.png' },
  { name: 'ScrapDrift', avatar: '/profiles/scrapdrift.png' },
  { name: 'Nova13', avatar: '/profiles/nova13.png' },
  { name: 'Zosi', avatar: '/profiles/zosi.png' },
  { name: 'Eclipse9', avatar: '/profiles/eclipse9.png' },
  { name: 'Blizzard', avatar: '/profiles/blizzard.png' },
  { name: 'Razorbyte', avatar: '/profiles/razorbyte.png' },
];

const usernames = {
  ScrapDrift: '@2tabsdreamin',
  Spark: '@idrawspark',
  Venoma: '@a$apvenoma',
  GlitchFang: '@glitchinyomama',
  Blizzard: '@blizzywitdatglizzy',
  Eclipse9: '@neverthere',
  Nova13: '@zenithnova',
  Zosi: '@queenzo',
  Razorbyte: '@razorr',
};

const voteMemory = {};

function getInitialVotes(name) {
  if (!voteMemory[name]) {
    voteMemory[name] = { likes: 0, dislikes: 0 };
  }
  return voteMemory[name];
}

function recordUserVote(name, type) {
  const votes = JSON.parse(localStorage.getItem('punkxVotes') || '{}');
  votes[name] = type;
  localStorage.setItem('punkxVotes', JSON.stringify(votes));
}

export default function PunkXPage() {
  const [posts, setPosts] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [username, setUsername] = useState('');
  const [comments, setComments] = useState({});

  useEffect(() => {
    const storedUsername = localStorage.getItem('punkx-username');
    if (!storedUsername) {
      const input = prompt("Choose your PunkX username:");
      if (input) {
        localStorage.setItem('punkx-username', input);
        setUsername(input);
      }
    } else {
      setUsername(storedUsername);
    }

    const stored = localStorage.getItem('punkxGeneratedReactions');
    if (stored) {
      const parsed = JSON.parse(stored);
      const posts = parsed.map((entry) => {
        const authorName = entry?.author?.trim();
        const racer = racers.find(r => r.name.toLowerCase() === authorName?.toLowerCase());

        return {
          name: racer?.name || authorName || 'Unknown',
          avatar: racer?.avatar || '/default-avatar.png',
          text: entry.text,
          time: `${Math.floor(Math.random() * 59) + 1}m ago`,
          handle: usernames[racer?.name] || '@unknown',
        };
      });
      setPosts(posts);
    } else {
      fetchGeneratedPosts();
    }

    const counts = {};
    const votes = JSON.parse(localStorage.getItem('punkxVotes') || '{}');
    racers.forEach(racer => {
      counts[racer.name] = getInitialVotes(racer.name);
    });
    setVoteCounts({ ...counts });
    setUserVotes(votes);
  }, []);

  const fetchGeneratedPosts = async () => {
    try {
      const res = await fetch('/api/generateReactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characters: racers.map(r => r.name),
          topic: "ScrapCrates"
        }),
      });

      const data = await res.json();
      if (!data.reactions) return;

      localStorage.setItem('punkxGeneratedReactions', JSON.stringify(data.reactions));

      const posts = data.reactions.map((entry) => {
        const authorName = entry?.author?.trim();
        const racer = racers.find(r => r.name.toLowerCase() === authorName?.toLowerCase());

        return {
          name: racer?.name || authorName || 'Unknown',
          avatar: racer?.avatar || '/default-avatar.png',
          text: entry.text,
          time: `${Math.floor(Math.random() * 59) + 1}m ago`,
          handle: usernames[racer?.name] || '@unknown',
        };
      });

      setPosts(posts);
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  const handleVote = (name, type) => {
    if (userVotes[name]) return;
    voteMemory[name][type] += 1;
    recordUserVote(name, type);
    setVoteCounts({ ...voteCounts, [name]: { ...voteCounts[name] } });
    setUserVotes({ ...userVotes, [name]: type });
  };

  const handleComment = async (name, text) => {
    if (!text.trim()) return;
    setComments(prev => ({
      ...prev,
      [name]: [...(prev[name] || []), { user: username, text }]
    }));

    try {
      const res = await fetch('/api/generateReactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character: name, comment: text }),
      });

      const data = await res.json();
      if (data.reactions && data.reactions[0]) {
        const aiReply = { user: name, text: data.reactions[0].text };
        setComments(prev => ({
          ...prev,
          [name]: [...(prev[name] || []), aiReply]
        }));
      }
    } catch (err) {
      console.error("Failed to get AI reply:", err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(/background2.png)' }} />

      <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/30 backdrop-blur-md text-white flex flex-wrap justify-center gap-6 text-sm font-medium border-b border-pink-500 shadow-md">
        <Link href="/" className="hover:underline">🏁 Home</Link>
        <Link href="/your-racerz" className="hover:underline">🎮 Inventory</Link>
        <Link href="/punkx" className="hover:underline">PunkX</Link>
        <Link href="/the-cyber-times" className="hover:underline"> Newz Feed</Link>
        <Link href="/weather-forecast" className="hover:underline">⛈ Weather</Link>
        <Link href="/interactions" className="hover:underline">🤖 Interact</Link>
        <Link href="/wallet-page" className="hover:underline">💰 Wallet</Link>
        <Link href="/weekly-messages" className="hover:underline">📈 Weekly Announcements</Link>
        <Link href="/race-simulator" className="hover:underline">🎮 Race Simulator</Link>
      </nav>

      <div className="pt-32 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-white">No posts available.</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="bg-black/80 text-white border border-pink-500 rounded-2xl shadow-xl p-4 flex gap-4 items-start">
                <img src={post.avatar} alt={post.name} className="rounded-full w-12 h-12" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{post.handle}</div>
                  <div className="font-bold text-pink-400">{post.name} <span className="text-xs text-gray-400 ml-2">{post.time}</span></div>
                  <div className="mt-1 text-sm mb-2">
                    {typeof post.text === 'object' && post.text !== null ? post.text.text : post.text}
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <button
                      onClick={() => handleVote(post.name, 'likes')}
                      disabled={userVotes[post.name]}
                      className="text-green-400 hover:text-green-300 disabled:opacity-40"
                    >
                      👍 {voteCounts[post.name]?.likes || 0}
                    </button>
                    <button
                      onClick={() => handleVote(post.name, 'dislikes')}
                      disabled={userVotes[post.name]}
                      className="text-red-400 hover:text-red-300 disabled:opacity-40"
                    >
                      👎 {voteCounts[post.name]?.dislikes || 0}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {(comments[post.name] || []).map((cmt, idx) => (
                      <div key={idx} className="text-sm text-gray-300">
                        <strong>{cmt.user}:</strong> {cmt.text}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.target.elements[`comment-${index}`];
                    handleComment(post.name, input.value);
                    input.value = '';
                  }} className="mt-2">
                    <input
                      type="text"
                      name={`comment-${index}`}
                      placeholder="Add a comment..."
                      className="w-full p-2 rounded bg-gray-800 text-white text-sm"
                    />
                  </form>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block">
          <img
            src="/advert1.png"
            alt="CyberDate Ad"
            className="rounded-2xl w-full shadow-xl border border-pink-500"
          />
          <img
            src="/grimmcrate.png"
            alt="GrimmCrate Ad"
            className="rounded-2xl w-full mt-6 shadow-xl border border-pink-500"
          />
        </div>
      </div>
    </div>
  );
}








