import React, { useState } from "react";
import { Sparkles, ChevronRight, Mail, ArrowRight } from "lucide-react";

const CallToAction: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSignup = () => {
    if (email.trim()) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
      // In a real app, this would handle the signup
      console.log("Signing up:", email);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Ocean Sunset Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500 via-slate-700 to-slate-900"></div>

      {/* Wave Animations */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-32"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            className="fill-slate-800/60 animate-wave"
          />
          <path
            d="M0,80 C200,120 400,40 600,80 C800,120 1000,40 1200,80 L1200,120 L0,120 Z"
            className="fill-slate-700/40 animate-wave-reverse"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Treasure Chest Animation */}
        <div className="mb-12">
          <div
            className={`relative inline-block transform ${
              isAnimating ? "scale-110 animate-bounce" : ""
            } transition-transform duration-500`}
          >
            {/* Treasure Chest */}
            <div className="w-32 h-24 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg relative shadow-2xl">
              {/* Chest Lid */}
              <div
                className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-t-lg transform-gpu origin-bottom transition-transform duration-1000 ${
                  isAnimating ? "-rotate-45 translate-y-2" : ""
                }`}
              >
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-amber-700 rounded-sm"></div>
              </div>

              {/* Chest Body */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-b-lg"></div>

              {/* Treasure Sparkles */}
              {isAnimating && (
                <>
                  <Sparkles className="absolute -top-4 left-4 w-6 h-6 text-amber-300 animate-ping" />
                  <Sparkles className="absolute -top-2 right-2 w-4 h-4 text-orange-300 animate-ping delay-300" />
                  <Sparkles className="absolute top-2 left-2 w-5 h-5 text-amber-400 animate-ping delay-700" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Start Your
          <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            Culinary Adventure?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
          Join thousands of fellow pirates who've discovered the treasure of
          effortless cooking. Your next favorite recipe is just a search away!
        </p>

        {/* Email Signup */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl">
            <Mail className="w-6 h-6 text-amber-300/80 mr-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@treasure.com"
              className="flex-1 bg-transparent text-white text-lg placeholder-white/60 outline-none"
            />
            <button
              onClick={handleSignup}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Join the Crew</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Additional CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-slate-600 to-blue-700 text-white font-bold text-lg rounded-2xl hover:from-slate-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-xl flex items-center space-x-2">
            <span>Start Your Quest</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="text-white/80 text-sm">
            Free forever • No credit card required
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-white">
          <div>
            <div className="text-3xl font-bold mb-2">10,000+</div>
            <div className="text-white/80">Recipes Discovered</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50,000+</div>
            <div className="text-white/80">Happy Pirates</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">1M+</div>
            <div className="text-white/80">Meals Created</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
