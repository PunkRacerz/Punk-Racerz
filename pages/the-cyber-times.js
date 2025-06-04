import React, { useEffect, useState } from 'react';
import backgroundImage from '@/public/background2.png';
import Link from 'next/link';
import articles from '@/data/articles';

export default function TheCyberTimes() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [reactionMessage, setReactionMessage] = useState(null);

  useEffect(() => {
    const now = new Date();
    const publishedArticles = articles.filter(article => new Date(article.releaseAt) <= now);
    setNewsArticles(publishedArticles);
  }, []);

  const handleGenerateReactions = async () => {
    setGenerating(true);
    setReactionMessage(null);
    try {
      const latestArticle = newsArticles[newsArticles.length - 1];
      const res = await fetch('/api/generateReactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: latestArticle })
      });
  
      const data = await res.json();
  
      if (data.posts && Array.isArray(data.posts)) {
        localStorage.setItem('punkxGeneratedReactions', JSON.stringify(data.posts));
        setReactionMessage(`Generated ${data.posts.length} PunkX reactions for "${latestArticle.title}".`);
      } else {
        setReactionMessage('No valid reactions received.');
      }
    } catch (err) {
      console.error(err);
      setReactionMessage('Failed to generate reactions.');
    } finally {
      setGenerating(false);
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

      <div className="bg-black bg-opacity-80 max-w-5xl mx-auto py-12 px-4 rounded-md shadow-lg">
        <header className="text-center border-b-4 border-gray-800 pb-6 mb-8">
          <h1 className="text-5xl font-extrabold tracking-widest uppercase text-pink-400">
            The Cyber Times
          </h1>
          <p className="text-md text-pink-400 mt-2 italic">
            "Your trusted feed of data, drama, and digital decay"
          </p>

          <div className="mt-6">
            <button
              onClick={handleGenerateReactions}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow"
              disabled={generating || newsArticles.length === 0}
            >
              {generating ? 'Generating Reactions...' : 'Generate PunkX Reactions'}
            </button>
            {reactionMessage && <p className="mt-2 text-sm text-pink-300">{reactionMessage}</p>}
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {newsArticles.map((article) => (
            <article key={article.id} className="bg-black bg-opacity-70 p-6 rounded-lg shadow-md border border-pink-400 hover:shadow-lg transition">
              <img src={article.imageUrl} alt={article.title} className="w-full h-100 object-cover rounded mb-4" />
              <h2 className="text-2xl font-bold text-pink-300 mb-2">{article.title}</h2>
              <p className="text-sm text-pink-300 mb-1">By {article.author} — {new Date(article.publishedAt).toLocaleDateString()}</p>
              <p className="text-pink-200 mb-4">{article.summary}</p>
              <button className="text-pink-400 hover:underline">Read More</button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}