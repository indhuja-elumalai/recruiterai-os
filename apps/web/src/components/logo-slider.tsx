"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

// Reliable CDN for standard logos
const GET_LOGO = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export function LogoSlider() {
  const platforms = [
    { name: "LinkedIn", color: "#0077B5", slug: "linkedin" },
    { name: "Naukri", color: "#2E3192", slug: "" }, 
    { name: "Indeed", color: "#2164F3", slug: "indeed" },
    { name: "Wellfound", color: "#FA4C59", slug: "wellfound" },
    { name: "Glassdoor", color: "#0CAA41", slug: "glassdoor" },
    { name: "Monster", color: "#6E489D", slug: "monster" },
    { name: "AngelOne", color: "#FF7D00", slug: "" }, 
    { name: "Instahyre", color: "#1D2939", slug: "" }, 
    { name: "IIMJobs", color: "#E31E24", slug: "" }, 
    { name: "Cutshort", color: "#FB923C", slug: "" }, 
  ];

  const duplicatedPlatforms = [...platforms, ...platforms];
  
  const [offset, setOffset] = useState(0);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t, delta) => {
    setOffset((prev) => {
      // Speed control
      const moveAmount = 0.12 * delta;
      // Change: Add moveAmount instead of subtracting to move Left -> Right
      const newOffset = prev + moveAmount;

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const itemWidth = isMobile ? 160 : 240;
      const gap = isMobile ? 32 : 64;
      const setWidth = platforms.length * (itemWidth + gap);

      // Reset logic for Left -> Right: 
      // If we move past the setWidth, we snap back to 0
      if (newOffset >= 0) {
        return newOffset - setWidth;
      }
      return newOffset;
    });
  });

  return (
    <section className="py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden border-y border-gray-900">
      <div className="max-w-7xl mx-auto px-4 mb-12 lg:mb-20 text-center">
        {/* MINIMAL WHITE TYPOGRAPHY */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
          Post Once, Reach Everywhere
        </h2>
        <p className="text-base lg:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          RecruiterAI automatically syncs your job postings across all major platforms
        </p>
      </div>

      <div className="relative">
        {/* Edge Blurs */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-20 pointer-events-none" />

        <div className="flex items-center h-32 overflow-hidden">
          <motion.div 
            ref={contentRef}
            className="flex gap-8 lg:gap-16 items-center whitespace-nowrap" 
            style={{ x: offset }}
          >
            {duplicatedPlatforms.map((platform, index) => (
              <motion.div
                key={index}
                onClick={() => setClickedIndex(index)}
                className="flex-shrink-0 w-[160px] lg:w-[240px] flex items-center justify-center cursor-pointer"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="flex items-center gap-3 transition-all duration-300"
                  animate={{
                    filter: clickedIndex === index ? "grayscale(0%)" : "grayscale(100%)",
                    opacity: clickedIndex === index ? 1 : 0.3,
                  }}
                  variants={{
                    hover: { filter: "grayscale(0%)", opacity: 0.8, scale: 1.02 }
                  }}
                >
                  {platform.slug ? (
                    <img 
                      src={GET_LOGO(platform.slug)} 
                      alt={platform.name}
                      className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
                    />
                  ) : (
                    <div 
                      className="w-6 h-6 lg:w-8 lg:h-8 rounded-md flex items-center justify-center font-bold text-white text-[10px] lg:text-xs"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                  )}

                  <span 
                    className="text-lg lg:text-2xl font-semibold tracking-tight"
                    style={{ color: platform.color }}
                  >
                    {platform.name}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}