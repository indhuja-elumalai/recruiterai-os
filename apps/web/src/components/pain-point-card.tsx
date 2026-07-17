import { motion } from "framer-motion";

interface PainPointCardProps {
  name: string;
  title: string;
  quote: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function PainPointCard({ name, title, quote, position }: PainPointCardProps) {
  const positionClasses = {
    "top-left": "lg:absolute lg:top-0 lg:left-0",
    "top-right": "lg:absolute lg:top-0 lg:right-0",
    "bottom-left": "lg:absolute lg:bottom-0 lg:left-0",
    "bottom-right": "lg:absolute lg:bottom-0 lg:right-0",
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <motion.div
      animate={floatingAnimation}
      className={`${positionClasses[position]} max-w-xs`}
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <p className="text-sm text-[#737373] mb-4 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#B197FC] flex items-center justify-center text-white">
            {name.split(" ")[0][0]}
          </div>
          <div>
            <p className="text-sm">{name}</p>
            <p className="text-xs text-[#737373]">{title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
