"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { LayeredFlowchart } from "./layered-flowchart"; 

export function HowItWorks() {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const section = document.getElementById("how-it-works");
      if (section) {
        const rect = section.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const workflows = [
    {
      title: "Automated Screening & Scheduling",
      description: "Our engine parses thousands of data points instantly, matching candidate intent with technical requirements while handling the logistics of booking interviews.",
      benefit: "250+ applications screened in minutes, not hours",
      steps: [
        { label: "New Application", sub: "Candidate submission received", color: "#3B82F6", icon: "CheckCircle2" },
        { label: "AI Resume Screening", sub: "Ranks top 20% of candidates", color: "#A5D8FF", icon: "BarChart3" },
        { label: "Auto-Send Questions", sub: "Screening queries to qualified", color: "#B197FC", icon: "Mail" },
        { 
          label: "Qualification Score", 
          sub: "Score > 75% Threshold", 
          color: "#D0BCFF", 
          isFork: true, 
          yesLabel: "Auto-schedule interview", 
          noLabel: "Thank you + Talent pool",
          criteria: "75%"
        },
        { label: "Interview Reminder", sub: "Sent 24 hours before meeting", color: "#3B82F6", icon: "Zap" },
      ]
    },
    {
      title: "Multi-Stage Interview Automation",
      description: "Standardize your technical vetting with automated rubrics and multi-round decision logic that moves top talent through the pipeline in record time.",
      benefit: "Reduce time-to-hire from 42 days to 12 days",
      steps: [
        { label: "Invite Accepted", sub: "Candidate enters Round 1", color: "#3B82F6", icon: "CheckCircle2" },
        { label: "AI Video Interview", sub: "Technical & AI assessment", color: "#A5D8FF", icon: "Zap" },
        { label: "Custom Rubric Scoring", sub: "AI analyzes response data", color: "#B197FC", icon: "BarChart3" },
        { 
          label: "Decision Point", 
          sub: "Score > 85% Threshold", 
          color: "#D0BCFF", 
          isFork: true, 
          yesLabel: "Auto-schedule Round 2", 
          noLabel: "Rejection + Feedback",
          criteria: "85%" 
        },
        { 
          label: "Final Hiring Decision", 
          sub: "Manager verification phase", 
          color: "#3B82F6", 
          isFork: true, 
          yesLabel: "Offer + Welcome Kit", 
          noLabel: "Rejection + Future Note" 
        }
      ]
    },
    {
      title: "Passive Candidate Re-engagement",
      description: "Automatically resurface 'Silver Medalist' candidates from your database when new roles open, turning your past applicants into a living talent ecosystem.",
      benefit: "Build a qualified talent pipeline automatically",
      steps: [
        { label: "Future Talent Database", sub: "Qualified borderline (60-74%)", color: "#3B82F6", icon: "BarChart3" },
        { label: "Patience Period", sub: "3-month automated wait", color: "#A5D8FF", icon: "Zap" },
        { 
          label: "Opportunity Match", 
          sub: "New relevant position opens?", 
          color: "#D0BCFF", 
          isFork: true, 
          yesLabel: "AI Re-engagement Email", 
          noLabel: "Recycle for next quarter",
          criteria: "Match"
        },
        { 
          label: "Interest Verification", 
          sub: "Check candidate availability", 
          color: "#B197FC", 
          isFork: true,
          yesLabel: "Fast-track to Interview",
          noLabel: "Continue in talent pool"
        },
        { label: "Database Refresh", sub: "Auto-checks next quarter", color: "#3B82F6", icon: "CheckCircle2" },
      ]
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-[#020202] overflow-hidden">
      {isMounted && (
        <motion.div 
          className="pointer-events-none absolute z-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] hidden lg:block"
          style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        
        {/* TOPIC PAGE: Dedicated viewport for the header */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
              Engineered Efficiency
            </motion.div>
            
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1] md:leading-[1.05] max-w-4xl mx-auto">
              AI recruiting software that works <br />
              <span className="text-neutral-500 font-medium">like your own HR team.</span>
            </h2>

            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 text-base md:text-lg font-normal max-w-xl mx-auto leading-relaxed"
            >
              Build custom hiring workflows in minutes. <br className="hidden md:block" />
              <span className="text-blue-500/80">No coding required.</span>
            </motion.p>
          </div>
        </div>

        {/* WORKFLOW ROWS: Follow after the topic page */}
        <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-40 space-y-32 md:space-y-64">
          {workflows.map((workflow, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-32 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left"
              >
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                    {workflow.title}
                  </h3>
                  <p className="hidden md:block text-sm md:text-xl text-neutral-500 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                    {workflow.description}
                  </p>
                </div>

                <div className="w-full md:max-w-md mx-auto lg:mx-0">
                  <motion.div 
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    className="hidden md:block relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl md:rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />
                    <div className="relative flex items-center gap-4 md:gap-6 p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-neutral-950/80 border border-white/10 backdrop-blur-xl overflow-hidden">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-blue-400 shadow-[0_0_12px_#3B82F6] animate-pulse" />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] text-blue-500/60 mb-1 md:mb-2">Milestone Result</p>
                        <p className="text-white text-sm md:text-xl font-medium tracking-tight leading-tight md:leading-snug">
                          {workflow.benefit}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex md:hidden items-center justify-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3B82F6] animate-pulse" />
                    <p className="text-neutral-500 text-sm font-medium tracking-tight text-left">
                      {workflow.benefit}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 w-full flex justify-center lg:justify-start"
              >
                <div className="w-full max-w-[450px] lg:max-w-full min-h-[350px] md:min-h-[500px]">
                  <LayeredFlowchart 
                    steps={workflow.steps} 
                    variant={index === 1 ? "sequential" : "layered"} 
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}