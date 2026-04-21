import React from "react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Updated to use --primary (Indigo) with 10% opacity */}
        <motion.div
          animate={{ rotate: [45, 90, 45], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-indigo-500/10 rounded-xl"
        ></motion.div>

        {/* Main Icon Container - Deep Slate Background */}
        <div className="relative w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg overflow-hidden border border-white/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 9L12 16L19 9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-y-0.5 transition-transform duration-300"
            />
          </svg>
          {/* Velocity Line - Matches Primary Indigo */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-indigo-400 rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="flex flex-col -space-y-1">
        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          Velo<span className="text-indigo-600">Hire</span>
        </span>
        <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase pl-0.5">
          AI Driven Platform
        </span>
      </div>
    </div>
  );
};

export default Logo;
