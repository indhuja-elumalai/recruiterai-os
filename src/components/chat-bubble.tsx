"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  name: string;
  role: string;
  image: string;
  message: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  phase: "expand" | "contract";
}

export function ChatBubble({ name, role, image, message, position, phase }: ChatBubbleProps) {
  const orbits = {
    "top-left": { x: -380, y: -200 },
    "top-right": { x: 380, y: -200 },
    "bottom-left": { x: -420, y: 180 },
    "bottom-right": { x: 420, y: 180 },
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ 
        x: phase === "contract" ? 0 : orbits[position].x,
        y: phase === "contract" ? 0 : orbits[position].y,
        opacity: phase === "contract" ? [1, 0] : [0, 1],
        scale: phase === "contract" ? 0.2 : 1,
      }}
      transition={{ 
        duration: phase === "contract" ? 0.6 : 1.2, 
        ease: phase === "contract" ? "backIn" : "circOut" 
      }}
      className="absolute z-40 pointer-events-none"
    >
      <div className={`relative flex flex-col transition-all duration-500 ease-in-out ${
        phase === "contract" 
          ? "w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_20px_#3B82F6] blur-[2px] mix-blend-screen" 
          : "bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl w-[300px] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      }`}>
        {phase !== "contract" && (
          <>
            {/* Header: Photo, Name, and Role */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm"
                />
                {/* Small indicator dot for "Verified" */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0A0A0A]" />
              </div>
              
              <div className="flex flex-col text-left">
                <p className="text-[12px] font-bold text-white tracking-tight">{name}</p>
                <p className="text-[10px] text-blue-400/80 font-medium tracking-wide leading-tight">
                  {role}
                </p>
              </div>
            </div>

            {/* Quote Section */}
            <div className="relative">
              <span className="absolute -top-2 -left-1 text-blue-500/30 text-3xl font-serif">“</span>
              <p className="text-[13px] text-gray-200 leading-relaxed font-light pl-3">
                {message}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}