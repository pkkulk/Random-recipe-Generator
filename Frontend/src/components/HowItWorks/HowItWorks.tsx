import React from 'react';
import { Package, Compass, Flag } from 'lucide-react';

const steps = [
  {
    icon: Package,
    title: "Raid Your Pantry",
    description: "Tell us what treasures you have in your kitchen. From fresh ingredients to pantry staples, we'll help you make the most of what you've got.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Compass,
    title: "Chart Your Course",
    description: "Our AI navigator analyzes your ingredients and charts the perfect course to delicious recipes that match your taste and dietary needs.",
    color: "from-slate-600 to-blue-700"
  },
  {
    icon: Flag,
    title: "Claim Your Feast",
    description: "Follow the treasure map to culinary gold! Get step-by-step instructions and even add missing ingredients to your shopping list.",
    color: "from-rose-500 to-pink-600"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Your Treasure Hunt Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate from pantry to plate in three simple steps. Join thousands of culinary adventurers who've discovered their next favorite meal!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8">
                <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                  {index + 1}
                </div>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-slate-700 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Treasure Chest Opening Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Connecting Line */}
        <div className="hidden md:block relative mt-8">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-slate-600 to-rose-500 opacity-20 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-slate-600 to-rose-500 opacity-40 transform -translate-y-1/2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;