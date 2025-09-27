import React from 'react';
import SearchBar from './SearchBar';
import FloatingIcons from './FloatingIcons';
import { useTypewriter } from '../../hooks/useTypewriter';

const Hero: React.FC = () => {
  const typewriterText = useTypewriter([
    "Ahoy! What treasures are in your pantry?",
    "Navigate your culinary adventure!",
    "Discover hidden recipe treasures!"
  ], 3000);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 animate-gradient-xy"></div>
      
      {/* Treasure Map Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Compass Rose */}
      <div className="absolute top-20 right-20 opacity-30">
        <div className="w-32 h-32 relative animate-spin-slow">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/40"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-amber-400/60"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-amber-400/40"></div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-amber-400/40"></div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-amber-400/40"></div>
        </div>
      </div>

      {/* Floating Icons */}
      <FloatingIcons />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Glassmorphic Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-amber-400/20 shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="block h-16 md:h-20">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Navigate your ingredients to discover hidden recipe treasures with AI-powered suggestions
          </p>

          <SearchBar />

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/70">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              <span>Smart ingredient matching</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span>Dietary preferences</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
              <span>Shopping assistance</span>
            </span>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" 
            className="fill-white animate-wave"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;