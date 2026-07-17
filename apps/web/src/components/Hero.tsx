import React from 'react';
import { motion } from 'motion/react';

const testimonialCards = [
  {
    name: "Sarah K.",
    title: "Founder at TechStart",
    quote: "Candidates wait 3 weeks for replies while I'm juggling everything. We're losing great talent to competitors.",
    position: "top-left"
  },
  {
    name: "Rahul M.",
    title: "Hiring Manager at GrowthCo",
    quote: "Posted on LinkedIn. Got 200 applications. Skimmed through 20. Hired on gut feeling. They quit in 2 months.",
    position: "top-right"
  },
  {
    name: "Priya S.",
    title: "CEO at InnovateLabs",
    quote: "I'm the CEO, product lead, AND now doing HR? There's zero time to read 200 resumes properly.",
    position: "bottom-left"
  },
  {
    name: "Amit T.",
    title: "Head of HR at ScaleUp",
    quote: "Our best candidate accepted another offer while we were still scheduling interviews.",
    position: "bottom-right"
  }
];

const positionClasses = {
  'top-left': 'top-4 left-4 md:top-12 md:left-8 lg:top-20 lg:left-12',
  'top-right': 'top-4 right-4 md:top-12 md:right-8 lg:top-20 lg:right-12',
  'bottom-left': 'bottom-4 left-4 md:bottom-12 md:left-8 lg:bottom-20 lg:left-12',
  'bottom-right': 'bottom-4 right-4 md:bottom-12 md:right-8 lg:bottom-20 lg:right-12'
};

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white overflow-hidden">
      {/* Floating testimonial cards - hidden on mobile for cleaner view */}
      <div className="hidden lg:block">
        {testimonialCards.map((card, index) => (
          <motion.div
            key={index}
            className={`absolute ${positionClasses[card.position as keyof typeof positionClasses]} max-w-xs z-10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.5 + index * 0.1 }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-sm text-[#737373] mb-3 leading-relaxed italic">
                "{card.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#B197FC] flex items-center justify-center text-white font-semibold text-sm">
                  {card.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#000000]">{card.name}</p>
                  <p className="text-xs text-[#737373]">{card.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main hero content */}
      <div className="relative z-20 container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#000000] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Every Hire, Faster and Better
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-[#404040] mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stop losing great candidates to slow, manual hiring processes. Let AI handle the heavy lifting while you focus on building your team.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#2563EB] transition-all hover:shadow-xl hover:scale-105">
              Start Hiring Smarter
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#3B82F6] text-[#3B82F6] rounded-xl font-semibold text-lg hover:bg-[#EFF6FF] transition-all">
              See How It Works
            </button>
          </motion.div>

          {/* Mobile testimonials - scrollable */}
          <div className="lg:hidden mt-16 space-y-4">
            {testimonialCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <p className="text-sm text-[#737373] mb-3 leading-relaxed italic">
                  "{card.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#B197FC] flex items-center justify-center text-white font-semibold text-xs">
                    {card.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#000000]">{card.name}</p>
                    <p className="text-xs text-[#737373]">{card.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
