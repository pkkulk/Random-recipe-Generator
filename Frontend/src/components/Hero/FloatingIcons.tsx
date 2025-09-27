import React from 'react';
import { ChefHat, Compass, Crown } from 'lucide-react';

const FloatingIcons: React.FC = () => {
  return (
    <>
      {/* Treasure Chest with Ingredients */}
      <div className="absolute top-1/4 left-10 animate-float">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-12">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-1/3 right-16 animate-float-delayed">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
          <Compass className="w-10 h-10 text-white animate-spin-slow" />
        </div>
      </div>

      {/* Crown (Captain's Hat) */}
      <div className="absolute bottom-1/3 left-1/4 animate-float-slow">
        <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg transform -rotate-12">
          <Crown className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Golden Treasure Particles */}
      <div className="absolute top-1/2 left-1/3 animate-bounce">
        <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg"></div>
      </div>
      <div className="absolute top-2/3 right-1/3 animate-bounce-delayed">
        <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg"></div>
      </div>
      <div className="absolute top-1/4 right-1/4 animate-pulse">
        <div className="w-4 h-4 bg-rose-400 rounded-full shadow-lg"></div>
      </div>

      {/* Pirate Ship Silhouette */}
      <div className="absolute bottom-20 right-10 opacity-20">
        <svg width="80" height="40" viewBox="0 0 100 50" className="text-white">
          <path
            d="M10 30 Q10 25 15 25 L85 25 Q90 25 90 30 L85 35 Q80 40 75 40 L25 40 Q20 40 15 35 Z"
            fill="currentColor"
          />
          <rect x="40" y="10" width="2" height="20" fill="currentColor" />
          <path d="M42 15 L55 20 L42 25 Z" fill="currentColor" />
        </svg>
      </div>
    </>
  );
};

export default FloatingIcons;