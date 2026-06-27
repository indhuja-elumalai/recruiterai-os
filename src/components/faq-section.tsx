"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "How does AI screening work?",
      answer: "Our AI analyzes resumes using natural language processing to understand candidate qualifications, experience, and skills. It scores candidates based on your custom criteria and job requirements, then automatically ranks them so you can focus on the best matches.",
    },
    {
      question: "Does RecruiterAI integrate with our ATS?",
      answer: "Yes! RecruiterAI integrates with all major ATS platforms including Greenhouse, Lever, Workday, BambooHR, and more. Our sync is bi-directional, so all candidate data stays updated across platforms.",
    },
    {
      question: "What's the pricing?",
      answer: "We offer flexible pricing based on your hiring volume. Plans start at $299/month for up to 10 active job postings. All plans include a 14-day free trial.",
    },
    {
      question: "How long does setup take?",
      answer: "Most teams are up and running in under 30 minutes. Simply connect your email, create your job posting, and customize your criteria. Our wizard guides you through each step.",
    },
    {
      question: "Is candidate data secure?",
      answer: "Absolutely. We're SOC 2 Type II certified and GDPR compliant. All data is encrypted in transit and at rest. We never sell candidate data, and you maintain full ownership.",
    },
  ];

  return (
    <section 
      id="faq-section" 
      ref={sectionRef} 
      className="py-24 bg-[#020202] relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* REFINED TOPIC: Clean, spacious, and professional */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-gray-500 text-[10px] font-medium tracking-[0.2em] uppercase"
          >
            <HelpCircle size={10} className="text-blue-500" />
            Support Center
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-[1.1]"
          >
            Frequently Asked <br />
            <span className="text-blue-500 italic font-medium">Questions</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-gray-500 font-light tracking-wide text-base md:text-xl max-w-2xl mx-auto"
          >
            Clear answers to help you navigate the future of hiring.
          </motion.p>
        </div>

        {/* ACCORDION AREA: Untouched as requested */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group transition-all duration-500 rounded-[2rem] border ${
                openIndex === index 
                ? "bg-white/[0.05] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
                : "bg-white/[0.02] border-white/5 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-7 flex items-center justify-between text-left"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  openIndex === index ? "text-blue-400" : "text-white/90"
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 ${
                  openIndex === index ? "bg-blue-500 text-white" : "bg-white/5 text-blue-500"
                }`}>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 text-gray-400 text-base md:text-lg leading-relaxed font-light">
                      <div className="pt-2 border-t border-white/5">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}