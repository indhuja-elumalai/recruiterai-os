"use client";

import { Linkedin, Twitter, Github, Mail, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Solid Bright Blue Background #3B82F6 */
    <footer className="bg-[#3B82F6] text-white py-24 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-8 group cursor-default">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Subtle outer glow for the logo on the bright background */}
                <div className="absolute inset-0 bg-white rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center shadow-xl border border-white/20">
                  <Zap className="text-[#3B82F6] w-5 h-5 fill-current" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                RecruiterAI
              </span>
            </div>
            <p className="text-white/80 text-base font-light leading-relaxed max-w-xs">
              Revolutionizing the hiring lifecycle with autonomous AI screening, 
              predictive analytics, and high-fidelity candidate matching.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Product</h4>
            <ul className="space-y-4 text-sm text-white/90 font-medium">
              <li><a href="#how-it-works" className="hover:underline transition-all">Features</a></li>
              <li><a href="#impact-results" className="hover:underline transition-all">Impact</a></li>
              <li><a href="#" className="hover:underline transition-all">Integrations</a></li>
              <li><a href="#" className="hover:underline transition-all">Pricing</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Company</h4>
            <ul className="space-y-4 text-sm text-white/90 font-medium">
              <li><a href="#" className="hover:underline transition-all">About</a></li>
              <li><a href="#testimonials" className="hover:underline transition-all">Testimonials</a></li>
              <li><a href="#" className="hover:underline transition-all">Careers</a></li>
              <li><a href="#" className="hover:underline transition-all">Contact</a></li>
            </ul>
          </div>

          {/* Legal/Compliance */}
          <div className="md:col-span-4">
            <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Legal & Trust</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/90 font-medium">
              <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/70 transition-colors">Security Portal</a>
              <a href="#" className="hover:text-white/70 transition-colors">GDPR Compliance</a>
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-white/20 flex-shrink-0" />
              <div className="w-8 h-8 rounded bg-white/20 flex-shrink-0" />
              <p className="text-[10px] text-white uppercase font-bold tracking-widest">Enterprise Ready</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[13px] text-white/70">
              © {currentYear} RecruiterAI. Built for the future of talent.
            </p>
            <div className="h-1 w-1 bg-white/30 rounded-full hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">System Operational</span>
            </div>
          </div>
          
          <div className="flex gap-6">
            {[Twitter, Linkedin, Github, Mail].map((Icon, idx) => (
              <a 
                key={idx}
                href="#" 
                className="group relative p-2 text-white/80 hover:text-white transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors" />
                <Icon className="w-5 h-5 relative z-10" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
