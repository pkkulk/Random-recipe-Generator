import React from 'react';
import { Compass, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Compass className="w-8 h-8 text-slate-700 animate-spin-slow" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-blue-800 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Pantry Pirate
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
              Features
            </a>
            <a href="#recipes" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
              Recipes
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
              Reviews
            </a>
            <button className="px-6 py-2 bg-gradient-to-r from-slate-700 to-blue-800 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Join the Crew
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
                Features
              </a>
              <a href="#recipes" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
                Recipes
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-slate-700 transition-colors font-medium">
                Reviews
              </a>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-slate-700 to-blue-800 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Join the Crew
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;