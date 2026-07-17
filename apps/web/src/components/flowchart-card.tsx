interface FlowchartCardProps {
  title: string;
  steps: string[];
  benefit: string;
}

export function FlowchartCard({ title, steps, benefit }: FlowchartCardProps) {
  return (
    <div className="bg-[#1F2937] rounded-3xl p-8 shadow-xl border border-gray-700/50 hover:border-[#3B82F6]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3B82F6]/10">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      
      <div className="bg-gradient-to-br from-[#0F0F0F] to-[#1a1a2e] rounded-2xl p-6 mb-6 border border-gray-800">
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="flex items-center gap-3">
                {step.includes("?") ? (
                  <div className="w-3 h-3 rotate-45 bg-[#D0BCFF] flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6] flex-shrink-0" />
                )}
                <span className="text-sm text-gray-300">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-[6px] w-px h-6 bg-[#3B82F6]/30" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#B197FC]/10 rounded-xl p-4 border border-[#3B82F6]/20">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-[#3B82F6] font-semibold">✓</span> {benefit}
        </p>
      </div>
    </div>
  );
}
