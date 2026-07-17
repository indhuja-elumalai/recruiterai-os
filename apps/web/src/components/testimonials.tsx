"use client";

import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Testimonials() {
  const [index, setIndex] = useState(0);

  const testimonials = [
    {
      quote: "We went from 6 weeks to hire a developer to just 10 days. RecruiterAI handled everything from screening to scheduling.",
      name: "Rahul Mehta",
      title: "Founder, TechStart Solutions",
      image: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?q=80&w=150&h=150&fit=crop",
    },
    {
      quote: "The AI screening saved me 15 hours a week. I can finally focus on building relationships with top candidates.",
      name: "Priya Sharma",
      title: "Head of People, GrowthLabs",
      image: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?q=80&w=150&h=150&fit=crop",
    },
    {
      quote: "Our quality of hire improved dramatically. The AI assessments catch things we would have missed manually.",
      name: "Amit Patel",
      title: "CTO, InnovateCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop",
    },
  ];

  const handleNext = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const getCardStyle = (itemIndex: number) => {
    const total = testimonials.length;
    const position = (itemIndex - index + total) % total;

    if (position === 0) {
      return { zIndex: 30, x: 0, scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" };
    } else if (position === 1) {
      return { zIndex: 20, x: "22%", scale: 0.8, rotate: 8, opacity: 0.4, filter: "blur(4px)" };
    } else {
      return { zIndex: 10, x: "-22%", scale: 0.8, rotate: -8, opacity: 0.4, filter: "blur(4px)" };
    }
  };

  return (
    <section id="testimonials" className="py-12 md:py-16 bg-[#020617] relative overflow-hidden lg:min-h-[90vh] flex flex-col justify-center">
      
      {/* DEEP BLUE GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)] pointer-events-none" />
      
      {/* Background Ambient Glow - Updated to a lighter cyan/blue for contrast */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* COMPACT & REFINED TOPIC */}
        <div className="text-center mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-200 text-[10px] font-medium tracking-[0.2em] uppercase"
          >
            <Sparkles size={10} className="text-blue-300" />
            Social Proof
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Why Businesses Trust <br />
            <span className="text-blue-300 font-medium italic">RecruiterAI</span>
          </h2>
          
          <p className="text-blue-100/60 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto">
            Don't take it from us, hear it from our users
          </p>
        </div>

        {/* COMPACT CARD AREA */}
        <div className="relative flex items-center justify-center min-h-[320px] md:min-h-[420px]">
          
          <button 
            onClick={handlePrev}
            className="hidden lg:flex absolute left-[-20px] xl:left-[-40px] z-40 p-3 rounded-full border border-blue-400/20 bg-blue-900/40 hover:bg-blue-800/60 text-white transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative w-full flex items-center justify-center">
            {testimonials.map((t, i) => {
              const style = getCardStyle(i);
              return (
                <motion.div
                  key={i}
                  animate={style}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className="absolute w-[280px] sm:w-[320px] md:w-[500px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex gap-1 mb-4 md:mb-6">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-blue-600 text-blue-600" />
                    ))}
                  </div>

                  <p className="text-sm md:text-lg text-slate-900 font-medium leading-relaxed mb-6 md:mb-8">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-6 md:pt-8">
                    <img 
                      src={t.image} 
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-blue-600 shadow-md" 
                      alt={t.name} 
                    />
                    <div>
                      <p className="font-bold text-slate-950 text-sm md:text-lg leading-tight">{t.name}</p>
                      <p className="text-[9px] md:text-xs text-blue-600 mt-0.5 font-bold uppercase tracking-[0.1em]">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button 
            onClick={handleNext}
            className="hidden lg:flex absolute right-[-20px] xl:right-[-40px] z-40 p-3 rounded-full border border-blue-400/20 bg-blue-900/40 hover:bg-blue-800/60 text-white transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* COMPACT NAVIGATION CONTROLS */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-8 lg:hidden">
            <button onClick={handlePrev} className="p-2 rounded-full border border-blue-400/20 bg-blue-900/40 text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNext} className="p-2 rounded-full border border-blue-400/20 bg-blue-900/40 text-white">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-blue-400' : 'w-1.5 bg-blue-400/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}