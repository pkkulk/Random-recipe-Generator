import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Captain Sarah",
    title: "Home Cook Extraordinaire",
    content: "Ahoy! Found amazing recipes with just crackers and cheese in me pantry. This app be the real treasure!",
    rating: 5,
    avatar: "from-pink-400 to-rose-500"
  },
  {
    name: "First Mate Jack",
    title: "Busy Dad of 3",
    content: "No more staring into the pantry wondering what to cook! The AI suggestions are pure gold for quick family meals.",
    rating: 5,
    avatar: "from-blue-400 to-indigo-500"
  },
  {
    name: "Chef Isabella",
    title: "Culinary Student",
    content: "Love how it helps me practice with random ingredients. It's like having a master chef guiding my culinary voyage!",
    rating: 5,
    avatar: "from-purple-400 to-pink-500"
  },
  {
    name: "Quartermaster Tom",
    title: "College Student",
    content: "Perfect for my tight budget! Shows me exactly where to buy missing ingredients at the best prices. Brilliant!",
    rating: 5,
    avatar: "from-green-400 to-emerald-500"
  },
  {
    name: "Admiral Grace",
    title: "Retired Food Critic",
    content: "Even this old sea dog learned new tricks! The recipe suggestions are sophisticated yet approachable.",
    rating: 5,
    avatar: "from-yellow-400 to-orange-500"
  },
  {
    name: "Bosun Mike",
    title: "Meal Prep Expert",
    content: "The nutritional tracking is spot on! Helps me stay on course with my health goals while discovering new flavors.",
    rating: 5,
    avatar: "from-cyan-400 to-blue-500"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            What Fellow Pirates Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of culinary adventurers who've discovered their treasure trove of recipes. Here's what the crew has to say!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden"
            >
              {/* Ship Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                <Quote className="w-8 h-8 text-slate-600" />
              </div>

              <div className="relative z-10">
                {/* Avatar */}
                <div className="mb-6 flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.avatar} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Ship rocking animation indicator */}
                <div className="absolute bottom-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-r from-slate-500 to-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;