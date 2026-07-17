"use client";

import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCta() {
  // Animation variant for the vertical text slide
  const slideUpVariants = {
    initial: { y: 0 },
    hover: { y: "-100%" },
  };

  // Typing animation variants
  const typingContainer = {
    hidden: { opacity: 1 },
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const typingLetter = {
    hidden: { opacity: 0, display: "none" },
    visible: { opacity: 1, display: "inline" },
  };

  const headlineText = "Ready to Hire Better, Faster?";

  return (
    <section 
      id="final-cta" 
      className="py-32 md:py-40 bg-[#020202] relative overflow-hidden"
    >
      {/* Background decoration - UNTOUCHED */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[420px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Refined Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-gray-500 text-[10px] font-medium tracking-[0.2em] uppercase">
            <Sparkles size={10} className="text-blue-500" />
            <span>Deployment Ready</span>
          </div>

          {/* Typing Headline */}
          <motion.h2 
            variants={typingContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
          >
            {headlineText.split("").map((char, index) => (
              <motion.span 
                key={index} 
                variants={typingLetter}
                className={index > 13 ? "text-blue-500 italic font-medium" : ""}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block w-[2px] h-[0.8em] bg-blue-500 ml-1 translate-y-1"
            />
          </motion.h2>
          
          {/* Updated Description */}
          <p className="text-base sm:text-lg text-gray-500 mb-12 max-w-xl mx-auto font-light tracking-wide">
            Join 500+ companies hiring smarter with AI.
          </p>

          {/* BUTTONS: Now wait for the headline to finish typing */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 0.5 }} // Delayed until typing finishes
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* REDUCED SIZE PRIMARY BUTTON */}
            <button className="group relative h-12 w-full sm:w-52 overflow-hidden rounded-xl bg-blue-600 text-white shadow-lg active:scale-95 transition-transform">
              <motion.div
                variants={slideUpVariants}
                initial="initial"
                whileHover="hover"
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col w-full h-full"
              >
                <span className="flex h-12 items-center justify-center gap-2 font-bold text-sm shrink-0">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </span>
                <span className="flex h-12 items-center justify-center gap-2 font-bold text-sm shrink-0 bg-blue-700">
                  Join Now <Sparkles className="w-4 h-4" />
                </span>
              </motion.div>
            </button>
            
            {/* REDUCED SIZE SECONDARY BUTTON */}
            <button className="group relative h-12 w-full sm:w-52 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md active:scale-95 transition-transform">
              <motion.div
                variants={slideUpVariants}
                initial="initial"
                whileHover="hover"
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col w-full h-full"
              >
                <span className="flex h-12 items-center justify-center gap-2 font-bold text-sm shrink-0">
                  <Calendar className="w-4 h-4 text-blue-500" /> Schedule Demo
                </span>
                <span className="flex h-12 items-center justify-center gap-2 font-bold text-sm shrink-0 bg-white/10">
                  Talk to Sales <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8, duration: 0.5 }} // Slight fade in after buttons
            className="mt-12 pt-8 border-t border-white/5"
          >
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-gray-600 font-medium uppercase tracking-[0.15em]">
              <span>No credit card required</span>
              <span className="hidden sm:block w-1 h-1 bg-white/10 rounded-full" />
              <span>14-day free trial</span>
              <span className="hidden sm:block w-1 h-1 bg-white/10 rounded-full" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
