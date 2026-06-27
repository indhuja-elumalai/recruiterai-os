"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";
import { ChatBubble } from "./chat-bubble";

export function HeroSection() {
  const [phase, setPhase] = useState("expand");
  const [cycle, setCycle] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // --- CURSOR GLOW LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // FIXED: Added Scroll function for the Explore button
  const handleExploreScroll = () => {
    // You can target the specific section ID that follows the Hero
    const nextSection = document.querySelector("#how-it-works");
    if (nextSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = nextSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const section = document.getElementById("hero-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const interval = setInterval(() => {
      setPhase("expand");
      const contractTimer = setTimeout(() => setPhase("contract"), 6000);
      setCycle((prev) => prev + 1);
      return () => clearTimeout(contractTimer);
    }, 8000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY]);

  const conversations = [
    { name: "Sarah K.", role: "Founder at TechStart", image: "https://i.pravatar.cc/150?u=sarah", message: "Candidates wait 3 weeks for replies. We're losing talent.", position: "top-left" },
    { name: "Rahul M.", role: "Hiring Manager at GrowthCo", image: "https://i.pravatar.cc/150?u=rahul", message: "Got 200 apps. Hired on gut feeling. They quit in 2 months.", position: "top-right" },
    { name: "Priya S.", role: "CEO at InnovateLabs", image: "https://i.pravatar.cc/150?u=priya", message: "Doing HR on top of product? No time for 200 resumes.", position: "bottom-left" },
    { name: "Amit T.", role: "Head of HR at ScaleUp", image: "https://i.pravatar.cc/150?u=amit", message: "Best candidate left while we were still scheduling.", position: "bottom-right" },
  ];

  const slideUpVariants = {
    initial: { y: 0 },
    hover: { y: "-100%" },
  };

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen bg-[#020202] overflow-hidden flex flex-col items-center justify-center pt-20 pb-10"
    >
      {/* --- DYNAMIC CURSOR GLOW --- */}
      {isMounted && (
        <motion.div 
          className="pointer-events-none absolute z-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] hidden lg:block"
          style={{ 
            left: 0,
            top: 0,
            x: smoothX, 
            y: smoothY, 
            translateX: "-50%", 
            translateY: "-50%" 
          }}
        />
      )}
      
      {/* --- ATOMIC ENERGY BG --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[100px]" />
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360, scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ rotate: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" }, duration: 4, repeat: Infinity }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px] hidden sm:block"
            style={{ marginLeft: `${100 + i * 15}px`, transformOrigin: `-${100 + i * 15}px center` }}
          />
        ))}

        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            animate={{ 
              rotate: ring % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              rotate: { duration: 15 + ring * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute border border-blue-500/10 md:border-blue-500/20 rounded-[45%_55%_70%_30%] w-[70vw] h-[70vw] md:w-[500px] md:h-[500px]"
            style={{ 
              transform: `rotate(${ring * 45}deg)`,
              opacity: 1 - (ring * 0.2) 
            }}
          />
        ))}
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-50 text-center px-6 w-full max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm overflow-hidden">
          <motion.span 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="bg-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-tighter shrink-0"
          >
            New
          </motion.span>
          
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <span className="text-gray-300 text-[11px] sm:text-xs font-medium tracking-wide">
              Automated AI Hiring Pipeline
            </span>
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse pr-1" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1] mb-8">
            Every Hire, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 italic font-light">
              Faster and Better.
            </span>
          </h1>

          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-lg font-light leading-relaxed mb-12">
            Stop losing top talent to manual processes. Let AI rank, screen, and schedule while you focus on the interview.
          </p>
        </motion.div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-[320px] sm:max-w-none mx-auto">
          <button className="group relative h-12 w-full sm:w-48 overflow-hidden rounded-full bg-blue-600 text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <motion.div variants={slideUpVariants} initial="initial" whileHover="hover" className="flex flex-col w-full h-full">
              <span className="flex h-12 items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest shrink-0">
                Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="flex h-12 items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest shrink-0 bg-blue-500">
                Join the Future <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          </button>

          <button className="group relative h-12 w-full sm:w-48 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-white transition-all active:scale-95 hover:bg-white/10">
            <motion.div variants={slideUpVariants} initial="initial" whileHover="hover" className="flex flex-col w-full h-full">
              <span className="flex h-12 items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest text-white/80 shrink-0">
                <Play className="w-3 h-3 fill-current" /> Watch Demo
              </span>
              <span className="flex h-12 items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest text-white shrink-0">
                AI in Action <Play className="w-3 h-3 fill-current" />
              </span>
            </motion.div>
          </button>
        </div>
      </div>

      {/* CHAT BUBBLES LAYER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        {conversations.map((conv, i) => (
          <ChatBubble key={`${cycle}-${i}`} {...conv} phase={phase} />
        ))}
      </div>

      {/* FIXED: SCROLL INDICATOR NOW CLICKABLE */}
      <motion.div 
        onClick={handleExploreScroll}
        animate={{ y: [0, 8, 0] }} 
        transition={{ duration: 2, repeat: Infinity }} 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 cursor-pointer z-50 hover:text-white transition-colors"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-black">Explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}