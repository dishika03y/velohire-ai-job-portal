import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  Clock,
  Sparkles,
  Globe,
} from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const logoUrl = job?.company?.logo
    ? `http://localhost:5000${job.company.logo}`
    : "/default-logo.png";

  const timeAgo = (date) => {
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 24 * 60 * 60),
    );
    return diff === 0 ? "Today" : `${diff}d ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group h-full p-[1px] rounded-[2rem] bg-slate-200 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
    >
      <div className="bg-white rounded-[1.95rem] p-6 h-full flex flex-col">
        {/* META INFO */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3 h-3" /> {timeAgo(job?.createdAt)}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          </div>
          <button className="text-slate-300 hover:text-rose-500 transition-colors">
            <Bookmark className="w-5 h-5 fill-current opacity-20 hover:opacity-100" />
          </button>
        </div>

        {/* COMPANY INFO */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl border border-slate-100 p-2 shrink-0 flex items-center justify-center bg-slate-50">
            <img
              src={logoUrl}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {job?.company?.name}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Globe className="w-3 h-3" /> Remote Hub
            </p>
          </div>
        </div>

        {/* ADAPTIVE TITLE SECTION */}
        <div className="mb-4">
          <h1 className="text-lg md:text-xl font-[1000] text-slate-900 leading-[1.2] tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3rem]">
            {job?.title}
          </h1>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 opacity-70 italic">
          {job?.description ||
            "Join our team to build the future of industry-leading tech solutions."}
        </p>

        {/* STATS SPACING - Push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
              {job?.jobType}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
              {job?.salary} LPA
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
              {job?.position} Roles
            </div>
          </div>

          <Button
            onClick={() => navigate(`/description/${job?._id}`)}
            className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group/btn"
          >
            View Opportunity
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Job;
