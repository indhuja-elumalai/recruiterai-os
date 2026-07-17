import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedFlowchart } from "./animated-flowchart";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Workflow {
  title: string;
  steps: string[];
  benefit: string;
}

interface WorkflowCarouselProps {
  workflows: Workflow[];
}

export function WorkflowCarousel({ workflows }: WorkflowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % workflows.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + workflows.length) % workflows.length);
  };

  const currentWorkflow = workflows[currentIndex];
  const isLeftLayout = currentIndex % 2 === 0;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`grid lg:grid-cols-2 gap-16 items-center ${
              isLeftLayout ? "" : "lg:grid-flow-dense"
            }`}
          >
            {/* Content side */}
            <div className={isLeftLayout ? "lg:order-1" : "lg:order-2"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                  {currentWorkflow.title}
                </h3>

                <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#B197FC]/10 rounded-2xl p-6 border border-[#3B82F6]/20 mb-8">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    <span className="text-[#3B82F6] font-bold text-2xl mr-2">✓</span>
                    {currentWorkflow.benefit}
                  </p>
                </div>

                {/* Slide indicators */}
                <div className="flex items-center gap-3">
                  {workflows.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-12 bg-[#3B82F6]"
                          : "w-8 bg-gray-700 hover:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Flowchart side */}
            <div className={isLeftLayout ? "lg:order-2" : "lg:order-1"}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <AnimatedFlowchart steps={currentWorkflow.steps} />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
