import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchX,
  Briefcase,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import Footer from "./shared/Footer";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);

  // UseMemo for filtering - Optimization to prevent recalculation on every re-render
  const processedJobs = useMemo(() => {
    if (!Array.isArray(allJobs)) return [];
    if (!searchedQuery) return allJobs;

    const query = searchedQuery.toLowerCase();
    return allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query),
    );
  }, [allJobs, searchedQuery]);

  useEffect(() => {
    setFilterJobs(processedJobs);
  }, [processedJobs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* --- 1. ENHANCED PAGE HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
              <span>Careers</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">Open Roles</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              Engineering Roles
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
            <button className="p-2 bg-slate-50 rounded-lg text-indigo-600 shadow-inner">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* --- 2. SIDEBAR WITH GLASSMOPHISM --- */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="lg:sticky lg:top-28 z-20">
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/60 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-2">
                {/* Decorative Blur */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50" />
                <FilterCard />
              </div>
            </div>
          </aside>

          {/* --- 3. RESULTS GRID --- */}
          <section className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
                  {filterJobs.length} Live Opportunities
                </h2>
              </div>

              {searchedQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-tight"
                >
                  <SearchX className="w-3 h-3" />"{searchedQuery}"
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {filterJobs.length <= 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full flex flex-col items-center justify-center py-20 lg:py-32 rounded-[3rem] bg-white border-2 border-dashed border-slate-200 text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-40 animate-pulse" />
                    <div className="relative w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                      <SearchX className="w-12 h-12 text-slate-300" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-[1000] text-slate-900 mb-3 tracking-tight">
                    No results found
                  </h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Try broadening your search or adjusting the filters to see
                    more results.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filterJobs.map((job) => (
                      <motion.article
                        key={job?._id}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="h-full"
                      >
                        <Job job={job} />
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
