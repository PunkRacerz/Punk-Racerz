import { useState, useEffect } from 'react';

export default function LoadingScreen({ isLoaded, onStart }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/loadingscreen1.png', '/loadingscreen2.png', '/loadingscreen3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white relative">
      <img
        src={images[currentImage]}
        alt="Loading..."
        className="w-full h-full object-cover absolute top-0 left-0 z-0 opacity-60"
      />
      <div className="z-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Initializing Track...</h1>
        {isLoaded && (
          <button
            onClick={onStart}
            className="mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg transition-all"
          >
            START RACE
          </button>
        )}
      </div>
    </div>
  );
}



