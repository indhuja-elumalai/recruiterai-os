"use client";

import { Zap, Clock, Users, CheckCircle, Target, DollarSign, TrendingDown, Sparkles, XCircle } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export function ImpactResults() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Vetting Scanner States
  const [resumeIndex, setResumeIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const mockResumes = [
    { 
      name: "Sarah Jenkins", 
      role: "UX Architect", 
      status: "approved", 
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      tags: ["Figma Mastery", "System Design", "User Research"],
      score: "98/100"
    },
    { 
      name: "Marcus V.", 
      role: "Sales Lead", 
      status: "waitlist", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      tags: ["CRM Mastery", "B2B Strategy", "Negotiation"],
      score: "82/100"
    },
    { 
      name: "Tom Harrison", 
      role: "Project Manager", 
      status: "rejected", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      tags: ["Agile Lead", "Budgeting", "Scrum Master"],
      score: "45/100"
    },
    { 
      name: "Maya Patel", 
      role: "Software Eng.", 
      status: "approved", 
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      tags: ["React / Next.js", "Node.js Architecture", "AWS Cloud"],
      score: "94/100"
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const section = document.getElementById("impact-results");
      if (section) {
        const rect = section.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Auto-cycle Resumes
    const interval = setInterval(() => {
      setIsScanning(false);
      setResumeIndex((prev) => (prev + 1) % mockResumes.length);
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY, mockResumes.length]);

  // Sync scan bar to card arrival
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(true), 800);
    return () => clearTimeout(timer);
  }, [resumeIndex]);

  const metrics = [
    { icon: Zap, value: "10x", label: "Faster Screening", description: "AI ranks 250+ applications per day vs 25 manually", color: "#3B82F6", gradient: "from-blue-500 to-cyan-400", trend: [20, 45, 30, 85, 95] },
    { icon: Clock, value: "70%", label: "Faster Hiring", description: "Hiring timeline drops from 42 days to just 12 days", color: "#8B5CF6", gradient: "from-violet-500 to-fuchsia-400", trend: [90, 75, 50, 35, 15] },
    { icon: Users, value: "25x", label: "More Capacity", description: "AI conducts 200+ screening interviews daily vs 8 manual calls", color: "#3B82F6", gradient: "from-blue-600 to-blue-400", trend: [15, 35, 55, 75, 100] },
    { icon: CheckCircle, value: "95%", label: "Completion Rate", description: "Smart forms reduce candidate drop-off dramatically", color: "#22D3EE", gradient: "from-cyan-400 to-blue-500", trend: [45, 55, 70, 85, 95] },
    { icon: Target, value: "89%", label: "More Qualified", description: "JD optimizer attracts higher-quality candidate pipelines", color: "#A855F7", gradient: "from-purple-500 to-indigo-400", trend: [35, 50, 65, 80, 89] },
    { icon: DollarSign, value: "80%", label: "Lower Costs", description: "Lower recruitment costs vs traditional agencies", color: "#3B82F6", gradient: "from-blue-500 to-indigo-500", trend: [95, 80, 60, 40, 20] },
    { icon: TrendingDown, value: "50%", label: "Less Bad Hires", description: "AI assessments improve hiring accuracy dramatically.", color: "#6366F1", gradient: "from-indigo-500 to-purple-500", trend: [60, 45, 35, 20, 15] },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 110;
  const sliceAngle = 360 / metrics.length;

  const currentResume = mockResumes[resumeIndex];

  return (
    <section id="impact-results" className="relative min-h-[100dvh] lg:min-h-0 py-12 lg:py-32 bg-[#f8fafc] text-slate-900 overflow-hidden border-y border-slate-200 flex flex-col justify-center">
      {isMounted && (
        <motion.div className="pointer-events-none absolute z-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] hidden lg:block" style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }} />
      )}

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" style={{ backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-100/40 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
        {/* UPDATED MINIMAL HEADER SECTION */}
        <div className="mb-12 lg:mb-24 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-slate-200 bg-white/80 shadow-sm text-slate-500 text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-md">
            <Sparkles size={10} className="text-blue-500" /> Impact & Results
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            The RecruiterAI <br />
            <span className="text-blue-600 font-medium italic">
              Advantage
            </span>
          </motion.h2>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch h-[550px]">
          {/* LEFT: METRIC ACCORDION */}
          <div className="col-span-8 flex gap-3 h-full">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ width: hoveredIndex === index ? "420px" : "80px", backgroundColor: hoveredIndex === index ? "#000000" : "#0F172A" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 shadow-lg"
              >
                <div className="relative h-full flex flex-col p-6 items-center">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${hoveredIndex === index ? `bg-gradient-to-br ${metric.gradient}` : "bg-white/5"}`}>
                    <metric.icon className={`w-5 h-5 ${hoveredIndex === index ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <div className="flex-1 w-full relative">
                    <AnimatePresence mode="wait">
                      {hoveredIndex !== index ? (
                        <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-end pb-4 gap-6">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">{metric.label}</span>
                          <span className="text-2xl font-black text-white tracking-tighter [writing-mode:vertical-lr] rotate-180">{metric.value}</span>
                        </motion.div>
                      ) : (
                        <motion.div key="e" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full pt-8 items-start text-left">
                          <span className={`text-9xl font-black bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent tracking-tighter leading-none`}>{metric.value}</span>
                          <h4 className="text-xl font-bold text-white mt-4 uppercase tracking-tight">{metric.label}</h4>
                          <p className="text-slate-400 text-base mt-3 leading-relaxed max-w-[280px] font-light italic">"{metric.description}"</p>
                          <div className="mt-auto flex items-end gap-2 h-20 w-full">
                            {metric.trend.map((h, i) => (
                              <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.05 }} className={`flex-1 rounded-t-lg bg-gradient-to-t ${metric.gradient} origin-bottom opacity-60`} style={{ height: `${h}%` }} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: VETTING SCANNER (SLIDE UP/DOWN) */}
          <div className="col-span-4 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={resumeIndex}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                   opacity: 0, 
                   y: currentResume.status === "rejected" ? 200 : -200 
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-full max-w-[340px] bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img src={currentResume.image} alt={currentResume.name} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center shadow-sm
                      ${currentResume.status === 'approved' ? 'bg-emerald-500' : currentResume.status === 'rejected' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                      {currentResume.status === 'approved' ? <CheckCircle size={12} className="text-white" /> : 
                       currentResume.status === 'rejected' ? <XCircle size={12} className="text-white" /> : 
                       <Clock size={12} className="text-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-tight">{currentResume.name}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{currentResume.role}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">AI Analysis</span>
                    <span className={`text-sm font-black ${currentResume.status === 'rejected' ? 'text-rose-500' : 'text-emerald-500'}`}>{currentResume.score}</span>
                  </div>
                  {currentResume.tags.map((tag, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px] font-bold">
                      <span className="text-slate-500">{tag}</span>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isScanning ? 1 : 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                        {currentResume.status === 'rejected' && i === 1 ? <XCircle size={14} className="text-rose-400" /> : <CheckCircle size={14} className="text-emerald-500" />}
                      </motion.div>
                    </div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: isScanning ? 1 : 0 }} 
                  className={`mt-auto rounded-2xl py-4 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-lg
                    ${currentResume.status === 'approved' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                      currentResume.status === 'rejected' ? 'bg-rose-500 text-white shadow-rose-200' : 
                      'bg-blue-600 text-white shadow-blue-200'}`}
                >
                  {currentResume.status === 'approved' ? 'Verified Hire' : currentResume.status === 'rejected' ? 'Not a Match' : 'Shortlisted'}
                </motion.div>

                {isScanning && (
                  <motion.div initial={{ top: "-10%" }} animate={{ top: "110%" }} transition={{ duration: 1.8, ease: "easeInOut" }} 
                    className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_blue] z-10 pointer-events-none opacity-40"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE VIEW (REMAINS TOUCHED AS REQUESTED) */}
        <div className="lg:hidden flex flex-col items-center justify-between h-full gap-6">
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center mx-auto">
            <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 w-full h-full drop-shadow-xl">
              {metrics.map((metric, i) => {
                const isActive = activeIndex === i;
                const startAngle = i * sliceAngle;
                const endAngle = (i + 1) * sliceAngle;
                const midAngle = (startAngle + endAngle) / 2;
                const radians = (Math.PI * midAngle) / 180;
                const offset = isActive ? 12 : 0;
                const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
                const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
                const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
                const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
                return (
                  <motion.path
                    key={i}
                    d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                    fill={metric.color}
                    animate={{ x: offset * Math.cos(radians), y: offset * Math.sin(radians), opacity: isActive ? 1 : 0.35, scale: isActive ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setActiveIndex(i)}
                    className="cursor-pointer outline-none"
                    style={{ stroke: '#FFFFFF', strokeWidth: 3 }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 m-auto w-20 h-20 bg-slate-900 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-2xl z-20">
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex flex-col items-center">
                  <span className="text-xl font-black text-white leading-none">{metrics[activeIndex].value}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Impact</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 shadow-2xl p-6 rounded-[2rem] text-center">
                <div className="inline-block p-2 rounded-xl bg-slate-800 mb-3">
                    {(() => { const Icon = metrics[activeIndex].icon; return <Icon size={20} style={{ color: metrics[activeIndex].color }} />; })()}
                </div>
                <h4 className="text-lg font-black uppercase tracking-wider mb-2 text-white">{metrics[activeIndex].label}</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed italic px-2">"{metrics[activeIndex].description}"</p>
                <div className="flex justify-center gap-2 mt-6">
                  {metrics.map((_, i) => (
                    <button key={i} onClick={() => setActiveIndex(i)} className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-blue-500' : 'w-1.5 bg-slate-700'}`} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
