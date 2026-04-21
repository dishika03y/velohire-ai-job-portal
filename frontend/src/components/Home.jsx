import React, { useState } from "react";
import Navbar from "../components/shared/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronRight,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/shared/Footer";
import SearchSuggestions from "./SearchSuggestions";

// --- Floating UI: Tighter Scaling ---
const FloatingElement = ({ children, className, delay = 0, duration = 6 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
    transition={{
      opacity: { duration: 0.8, delay },
      y: { duration: duration, repeat: Infinity, ease: "easeInOut", delay },
    }}
    // OPTIMIZATION: Reduced internal padding from p-4 to p-3 and border-radius
    className={`absolute hidden xl:flex items-center gap-3 p-3.5 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_16px_32px_rgba(0,0,0,0.05)] rounded-3xl z-20 ${className}`}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />

      {/* --- HERO SECTION: RE-BALANCED --- */}
      {/* CHANGE: Added mt-6 to push the whole section down, and adjusted pt to 32 for better internal spacing */}
      <section className="relative mt-6 pt-32 pb-20 md:pb-28 px-6 overflow-hidden">
        {/* Abstract Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* OPTIMIZATION: Shifted the radial gradient down slightly (at 20% instead of 15%) to match the new margin */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[radial-gradient(circle_at_50%_20%,_#EEF2FF_0%,_transparent_75%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] brightness-100" />

          {/* Animated Gradients */}
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -20, 0],
              filter: ["blur(100px)", "blur(130px)", "blur(100px)"],
            }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute top-[10%] -right-[10%] w-[400px] h-[400px] bg-indigo-100/20 rounded-full"
          />
        </div>

        {/* --- FLOATING PILLS: RE-POSITIONED FOR SPACE --- */}
        {/* CHANGE: Shifted top from 25% to 30% so they don't sit too close to the Navbar */}
        <FloatingElement
          className="top-[40%] left-[8%]"
          delay={0.2}
          duration={5}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              Active Growth
            </p>
            <p className="text-base font-bold text-slate-800 tracking-tight">
              +120 Jobs Today
            </p>
          </div>
        </FloatingElement>

        <FloatingElement
          className="bottom-[25%] right-[10%]"
          delay={1}
          duration={7}
        >
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i}`}
                className="w-9 h-9 rounded-full border-4 border-white shadow-sm"
                alt="user"
              />
            ))}
          </div>
          <p className="text-xs font-black text-slate-700">5k+ Experts Live</p>
        </FloatingElement>

        {/* --- MAIN HERO CONTENT --- */}
        <motion.div
          style={{ y: yRange, opacity: opacityRange }}
          className="max-w-[1200px] w-full mx-auto text-center relative z-10"
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-xl shadow-indigo-100/20 mb-12"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              The Professional's Choice
            </span>
          </motion.div>

          {/* Headline: Slightly tighter tracking for a more "locked-in" look */}
          <h1 className="text-[clamp(3rem,7.5vw,6.5rem)] font-[1000] tracking-[-0.04em] leading-[0.95] text-slate-900 mb-10">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-shimmer bg-[length:200%_auto]">
              Professional Life.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium tracking-tight">
            VeloHire is where world-class talent meets{" "}
            <span className="text-slate-900 font-bold">
              unstoppable companies.
            </span>{" "}
            <br className="hidden md:block" /> Experience high-velocity
            matchmaking.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/jobs"
              className="group h-16 px-10 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="h-16 px-10 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg flex items-center hover:bg-slate-50 transition-all active:scale-95"
            >
              For Employers
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- TRUST SECTION: MARQUEE LIGHTENED --- */}
      {/* --- TRUST SECTION: BALANCED & LEGIBLE --- */}
      <section className="py-16 bg-white overflow-hidden border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Trusted by Industry Leaders
          </span>
          <div className="h-[1px] w-8 bg-slate-200" />
        </div>

        {/* CHANGE LOG: 
      1. Opacity bumped from 20 to 45 (Sweet spot for "secondary" content).
      2. Gap tightened slightly for better visual density.
      3. Added a subtle scale effect on the container hover.
  */}
        <div className="flex flex-wrap gap-12 md:gap-20 items-center justify-center opacity-45 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 px-6">
          {["Stripe", "Airbnb", "Linear", "Vercel", "Slack"].map((brand) => (
            <span
              key={brand}
              className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase transition-transform hover:scale-110 cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* --- FEATURE BENTO GRID: COMPACT OPTIMIZATION --- */}
      {/* OPTIMIZATION: Max-w from 1400px to 1300px, reduced py-40 to py-32 */}
      <section className="max-w-[1300px] mx-auto px-6 py-32">
        {/* OPTIMIZATION: Reduced gap from gap-10 to gap-8 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card 1: Vetting */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            // OPTIMIZATION: Reduced rounded-[4rem] to rounded-3xl, p-16 to p-12, min-h reduced
            className="md:col-span-7 bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden group min-h-[480px] flex flex-col justify-between"
          >
            {/* OPTIMIZATION: Reduced blur size and position */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-15 transition-opacity">
              <Globe className="w-48 h-48 text-indigo-400/20" />
            </div>
            <div className="relative z-10">
              {/* Reduced from w-20 h-20 rounded-[2rem] and mb-12 */}
              <div className="bg-indigo-500 w-16 h-16 rounded-3xl flex items-center justify-center mb-10 shadow-3xl shadow-indigo-500/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              {/* Reduced text size from text-6xl font-black mb-8 leading-[0.9] */}
              <h3 className="text-5xl font-extrabold mb-6 leading-[1.05] tracking-tight">
                Access the top <br /> 1% of talent.
              </h3>
              {/* Reduced text size from text-2xl max-w-md */}
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                We've done the vetting. You do the hiring. <br />
                Simple, fast, and effective.
              </p>
            </div>
            {/* Reduced text size */}
            <button className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm group-hover:gap-4 transition-all">
              Learn how we vet <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card 2: AI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            // OPTIMIZATION: Spacing and rounded corners reduced
            className="md:col-span-5 bg-indigo-600 rounded-3xl p-12 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group"
          >
            {/* Reduced from w-20 h-20 mb-12 */}
            <Sparkles className="w-16 h-16 mb-10 group-hover:rotate-[15deg] transition-transform duration-500" />
            <div>
              {/* Reduced text size text-4xl font-black mb-6 */}
              <h3 className="text-3xl font-extrabold mb-5 tracking-tight leading-tight">
                Neural <br />
                Matchmaking.
              </h3>
              {/* Reduced from text-xl */}
              <p className="text-indigo-100 text-base font-medium leading-relaxed">
                Our algorithms don't just look at keywords; they look at career
                trajectories.
              </p>
            </div>
          </motion.div>

          {/* Card 3: UPGRADED DUAL SEARCH INTERACTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-12 bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden"
          >
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-50/50 blur-[100px] -z-10" />

            <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center xl:text-left">
                <h3 className="text-5xl md:text-6xl font-[1000] text-slate-900 mb-6 leading-[0.95] tracking-tighter">
                  Stop searching. <br />
                  <span className="text-indigo-600">Start belonging.</span>
                </h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                  Search through 50,000+ verified high-growth roles across the
                  globe. Filter by tech stack, remote preference, and equity.
                </p>
              </div>

              {/* THE COMMAND CENTER */}
              <div className="w-full xl:w-auto">
                <div className="bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col gap-3">
                  {/* DUAL INPUT CONTAINER */}
                  <div className="flex flex-col lg:flex-row items-center bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                    {/* Role Input */}
                    <div className="relative w-full lg:w-[320px] group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Job title or keyword"
                        className="w-full h-16 pl-14 pr-4 outline-none text-base font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      />
                      {/* Integrated Suggestions */}
                      <SearchSuggestions
                        query={role}
                        type="role"
                        onSelect={(val) => setRole(val)}
                      />
                    </div>

                    {/* Location Input */}
                    <div className="relative w-full lg:w-[280px] group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location or Remote"
                        className="w-full h-16 pl-14 pr-4 outline-none text-base font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      />
                      <SearchSuggestions
                        query={location}
                        type="location"
                        onSelect={(val) => setLocation(val)}
                      />
                    </div>

                    {/* DESKTOP SEARCH BUTTON (Integrated into the bar) */}
                    <button className="hidden lg:flex h-16 px-8 bg-slate-900 hover:bg-indigo-600 text-white items-center gap-2 font-black transition-all group active:scale-95">
                      Search
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* MOBILE SEARCH BUTTON */}
                  <button className="lg:hidden w-full h-14 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-indigo-200">
                    Search Opportunities
                  </button>

                  {/* QUICK FILTERS */}
                  <div className="flex flex-wrap items-center gap-2 px-4 py-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                      Popular:
                    </span>
                    {["Frontend", "Indore", "Remote", "DevOps"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          tag === "Indore" ? setLocation(tag) : setRole(tag)
                        }
                        className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-5">
              <div className="relative">
                {/* Reduced icon size and positioning */}
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                {/* Reduced height from h-24 to h-16, rounding from rounded-[2.5rem], padding pl-20, font size text-2xl */}
                <input
                  type="text"
                  placeholder="What's your dream role?"
                  className="w-full lg:w-[420px] h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-100 transition-all text-lg font-bold placeholder:text-slate-300 shadow-inner"
                />
              </div>
              {/* Reduced height from h-24 and padding px-16, font size text-2xl */}
              <button className="h-16 px-12 bg-indigo-600 text-white font-black text-xl rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                Find My Path
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default Home;
