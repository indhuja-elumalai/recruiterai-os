"use client";

import { LoaderCircle, LogOut, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AuthDialog, type AuthMode } from "../auth/auth-dialog";
import { useAuth } from "../auth/auth-context";
import "./header-auth.css";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loggingOut, setLoggingOut] = useState(false);
  const { isLoading, logout, user } = useAuth();
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(7, 9, 13, 0.72)", "rgba(7, 9, 13, 0.94)"],
  );

  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"],
  );

  const navLinks = [
    { name: "Features", href: "#how-it-works-shell" },
    { name: "Impact", href: "#impact-results-shell" },
    { name: "Testimonials", href: "#testimonials-shell" },
    { name: "FAQ", href: "#faq-section-shell" },
  ];

  const slideUpVariants = {
    initial: { y: 0 },
    hover: { y: "-100%" },
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setMobileMenuOpen(false);
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        style={{ backgroundColor, borderColor: borderOpacity }}
        className="fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-2xl transition-all duration-300"
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={(e) => scrollToSection(e, "#hero-section")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-xl border border-white/20">
                <Zap className="text-white w-5 h-5 fill-current" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Recruiter<span className="text-blue-500">AI</span>
            </span>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  /* Changed text to blue (#3B82F6) and white on hover */
                  className="text-[13px] font-semibold text-[#3B82F6] hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6 border-l border-white/10 pl-10">
              {user ? (
                <div className="header-account">
                  <div className="header-account__avatar" aria-hidden="true">
                    {userInitials}
                  </div>
                  <div className="header-account__identity">
                    <span className="header-account__name">{user.name}</span>
                    <span className="header-account__role">{user.role.toLowerCase()}</span>
                  </div>
                  <button
                    aria-label={`Log out ${user.name}`}
                    className="header-account__logout"
                    disabled={loggingOut}
                    onClick={() => void handleLogout()}
                    title="Log out"
                  >
                    {loggingOut ? (
                      <LoaderCircle className="header-account__spinner" size={17} />
                    ) : (
                      <LogOut size={17} strokeWidth={2.2} />
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    disabled={isLoading}
                    onClick={() => openAuth("login")}
                    className="text-sm font-bold text-[#3B82F6] hover:text-white transition-colors disabled:opacity-50"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="group relative h-10 w-36 overflow-hidden rounded-full bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-transform"
                  >
                    <motion.div
                      variants={slideUpVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col w-full h-full"
                    >
                      <span className="flex h-10 items-center justify-center text-[11px] font-black uppercase tracking-widest shrink-0">
                        Get Started
                      </span>
                      <span className="flex h-10 items-center justify-center text-[11px] font-black uppercase tracking-widest shrink-0 bg-blue-400">
                        Join Now
                      </span>
                    </motion.div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden text-[#3B82F6] p-2 rounded-lg bg-white/5 border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-20 bg-black/40 backdrop-blur-md z-[-1] md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 left-0 w-full bg-[#0A0A0A]/80 border-b border-white/10 backdrop-blur-2xl p-8 md:hidden flex flex-col gap-6 shadow-2xl"
              >
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    /* Mobile links also blue */
                    className="text-2xl font-bold text-[#3B82F6] uppercase tracking-tighter italic hover:text-white transition-colors"
                    onClick={(e) => scrollToSection(e, link.href)}
                  >
                    {link.name}
                  </motion.a>
                ))}

                <hr className="border-white/5" />

                <div className="flex flex-col gap-4">
                  {user ? (
                    <div className="mobile-account">
                      <div className="header-account__avatar" aria-hidden="true">
                        {userInitials}
                      </div>
                      <div className="mobile-account__identity">
                        <span className="header-account__name">{user.name}</span>
                        <span className="mobile-account__email">{user.email}</span>
                      </div>
                      <button
                        aria-label={`Log out ${user.name}`}
                        className="header-account__logout mobile-account__logout"
                        disabled={loggingOut}
                        onClick={() => void handleLogout()}
                        title="Log out"
                      >
                        {loggingOut ? (
                          <LoaderCircle className="header-account__spinner" size={18} />
                        ) : (
                          <LogOut size={18} strokeWidth={2.2} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuth("login")}
                        className="w-full py-4 text-[#3B82F6] font-bold uppercase tracking-widest"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => openAuth("register")}
                        className="w-full py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
      <AuthDialog
        mode={authMode}
        open={authOpen}
        onModeChange={setAuthMode}
        onOpenChange={setAuthOpen}
      />
    </>
  );
}
