import React from "react";
import {
  Navigation,
  MapPin,
  Settings,
  Heart,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Navigation,
    title: "Smart Recipe Navigation",
    description:
      "Our compass shows exactly what ingredients you have versus what you need, guiding you to perfect recipe matches.",
    color: "from-slate-600 to-blue-700",
  },
  {
    icon: MapPin,
    title: "Merchant Integration",
    description:
      "Find the best prices and locations for missing ingredients with our treasure map of local stores and online merchants.",
    color: "from-emerald-600 to-teal-700",
  },
  {
    icon: Settings,
    title: "Dietary Compass",
    description:
      "Navigate around dietary restrictions and preferences. Whether you're vegan, keto, or have allergies, we'll chart your safe course.",
    color: "from-indigo-600 to-purple-700",
  },
  {
    icon: Heart,
    title: "Treasure Collection",
    description:
      "Build your personal recipe chest with favorites, notes, and modifications. Your culinary treasures, perfectly organized.",
    color: "from-rose-600 to-pink-700",
  },
  {
    icon: BookOpen,
    title: "Nutritional Log",
    description:
      "Keep a captain's log of your nutritional journey with detailed breakdowns and health tracking for every recipe.",
    color: "from-amber-600 to-orange-700",
  },
  {
    icon: TrendingUp,
    title: "Trending Discoveries",
    description:
      "Discover what fellow pirates are cooking! See trending recipes and seasonal ingredient combinations from our community.",
    color: "from-violet-600 to-indigo-700",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Your Pirate's Arsenal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every great pirate needs the right tools for their culinary
            adventures. Here's everything in your digital treasure chest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden"
            >
              {/* Porthole Design */}
              <div className="absolute top-4 right-4 w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center group-hover:border-blue-300 transition-colors">
                <div className="w-6 h-6 bg-gradient-to-r from-slate-500 to-blue-600 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Wave hover animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>

              {/* Icon */}
              <div className="mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-slate-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
