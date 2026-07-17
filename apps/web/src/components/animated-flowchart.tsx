import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedFlowchartProps {
  steps: string[];
}

export function AnimatedFlowchart({ steps }: AnimatedFlowchartProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev < steps.length) return prev + 1;
        return prev;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="relative bg-gradient-to-br from-[#0F0F0F] to-[#1a1a2e] rounded-3xl p-10 border border-white/10">
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => {
          const isDecision = step.includes("?");
          const isVisible = index < visibleSteps;

          return (
            <div key={index} className="relative">
              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={
                  isVisible
                    ? { opacity: 1, scale: 1, x: 0 }
                    : { opacity: 0, scale: 0.5, x: -20 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-4 relative z-10"
              >
                {/* Icon */}
                <motion.div
                  animate={
                    isVisible && isDecision
                      ? {
                          scale: [1, 1.15, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                      : {}
                  }
                  transition={
                    isDecision
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  {isDecision ? (
                    <div className="w-5 h-5 rotate-45 bg-gradient-to-br from-[#D0BCFF] to-[#B197FC] flex-shrink-0 shadow-lg shadow-[#D0BCFF]/50" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex-shrink-0 shadow-lg shadow-[#3B82F6]/50" />
                  )}
                </motion.div>

                {/* Text */}
                <span className="text-base text-gray-200 font-medium">
                  {step}
                </span>
              </motion.div>

              {/* Animated connector line */}
              {index < steps.length - 1 && (
                <div className="ml-[10px] w-px h-10 relative overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={
                      isVisible ? { height: "100%" } : { height: 0 }
                    }
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-full bg-gradient-to-b from-[#3B82F6] via-[#3B82F6]/50 to-transparent"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
