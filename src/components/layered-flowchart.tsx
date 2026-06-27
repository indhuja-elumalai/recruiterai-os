"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

interface Step {
  label: string;
  sub: string;
  color: string;
  icon?: string;
  isFork?: boolean;
  yesLabel?: string;
  noLabel?: string;
  criteria?: string;
}

export function LayeredFlowchart({ steps, variant = "layered" }: { steps: Step[], variant?: "layered" | "sequential" }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10% 0px -10% 0px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // COMPRESSION LOGIC: Tighten mobile (85px) vs Desktop (125px)
  const verticalGap = isMobile ? 85 : 125; 
  // Dynamic height to prevent elongation on mobile
  const containerHeight = isMobile ? steps.length * verticalGap + 40 : 720;
  const centerOffset = isMobile ? (steps.length * verticalGap) / 2 : (steps.length * verticalGap) / 2;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full flex items-center justify-center bg-transparent transition-all duration-500"
      style={{ height: `${containerHeight}px` }}
    >
      <div className="relative w-full max-w-[340px] md:max-w-[460px]" style={{ perspective: "1200px" }}>
        
        {steps.map((layer, index) => {
          // Subtle Y adjustment: tighter on mobile to prevent "elongation"
          const targetY = isInView ? (index * verticalGap - centerOffset) : (index * -10);
          const IconComponent = (LucideIcons as any)[layer.icon || "ArrowRight"];
          
          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                y: targetY,
                rotateX: isInView ? 0 : (isMobile ? 0 : 35),
                rotateZ: isInView ? 0 : (isMobile ? 0 : -5),
                opacity: isInView ? 1 : 0,
                scale: isInView ? 1 : (isMobile ? 0.98 : 1 - index * 0.02)
              }}
              style={{ 
                zIndex: steps.length - index, 
                position: 'absolute',
                left: 0,
                right: 0,
                transformStyle: "preserve-3d"
              }}
              transition={{ 
                type: "spring", 
                stiffness: isMobile ? 70 : 55, // Snappier on mobile
                damping: 20, 
                delay: isInView ? (variant === "sequential" ? index * 0.3 : index * 0.1) : 0 
              }}
            >
              <div className="relative flex items-center gap-3 md:gap-4 group">
                <div className={`relative flex-1 bg-[#080808]/95 backdrop-blur-3xl border ${layer.isFork ? 'border-[#3B82F6]/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/10'} rounded-xl p-3 md:p-4 transition-all duration-500`}>
                  
                  {/* Connection Line - Height matches the new tight gap */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isInView ? 1 : 0 }}
                      transition={{ delay: variant === "sequential" ? index * 0.3 + 0.2 : 0, duration: 0.3 }}
                      className="absolute left-8 md:left-10 top-full w-[1px] bg-gradient-to-b from-[#3B82F6]/40 to-transparent -z-10 origin-top" 
                      style={{ height: `${verticalGap - (isMobile ? 35 : 45)}px` }}
                    />
                  )}

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border shrink-0"
                         style={{ backgroundColor: `${layer.color}10`, borderColor: `${layer.color}25`, color: layer.color }}>
                      {IconComponent ? <IconComponent size={isMobile ? 14 : 18} /> : <LucideIcons.ArrowRight size={18} />}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5 md:gap-2">
                         <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/20">Phase 0{index + 1}</p>
                         {layer.criteria && (
                           <span className="text-[6px] md:text-[8px] bg-[#A5D8FF] text-black px-1 py-0.5 rounded font-black tracking-tighter uppercase">
                             {layer.criteria}
                           </span>
                         )}
                      </div>
                      <h4 className="text-white font-bold text-[11px] md:text-[13px] leading-tight mt-0.5 truncate">
                        {layer.label}
                      </h4>
                      
                      {/* Compact fork logic for mobile */}
                      {layer.isFork ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <div className="flex items-center gap-1 text-green-400 text-[8px] md:text-[10px] font-bold bg-green-400/5 py-0.5 px-1.5 rounded border border-green-400/10">
                            <LucideIcons.Check size={8}/> {layer.yesLabel}
                          </div>
                          {isMobile && (
                            <div className="flex items-center gap-1 text-red-400 text-[8px] font-bold bg-red-400/5 py-0.5 px-1.5 rounded border border-red-400/10">
                              <LucideIcons.X size={8}/> {layer.noLabel}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-white/40 text-[8px] md:text-[10px] mt-0.5 italic truncate">
                          {layer.sub}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* DESKTOP REJECTION (Side Branch) */}
                {layer.isFork && !isMobile && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -10 }}
                    transition={{ delay: index * 0.3 + 0.4 }}
                    className="relative w-[150px] shrink-0"
                  >
                    <div className="absolute -left-4 top-1/2 w-4 h-[1px] bg-red-500/30" />
                    <div className="bg-red-500/[0.03] border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
                      <span className="text-[8px] text-red-500/70 font-black uppercase tracking-widest block mb-1">No</span>
                      <p className="text-[9px] text-white/50 leading-tight font-medium">{layer.noLabel}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}