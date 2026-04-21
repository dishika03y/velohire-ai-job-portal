import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import { Badge } from "./ui/badge";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase().trim();
    switch (s) {
      case "accepted":
      case "selected":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Selected",
        };
      case "rejected":
        return {
          color: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-100",
          icon: <XCircle className="w-4 h-4" />,
          label: "Declined",
        };
      default:
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          icon: <Clock className="w-4 h-4" />,
          label: "In Review",
        };
    }
  };

  if (allAppliedJobs.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="p-5 bg-white rounded-full shadow-sm mb-4">
          <Building2 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-800">
          No active applications
        </h3>
        <p className="text-slate-500 font-medium">
          Your career journey starts with the first click.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between px-6 mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Application History
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {allAppliedJobs.length} Positions
        </span>
      </div>

      <div className="grid gap-3">
        {allAppliedJobs.map((appliedJob, index) => {
          const theme = getStatusTheme(appliedJob?.status);

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              key={appliedJob._id}
              className="group relative bg-white border border-slate-200 hover:border-indigo-400 p-6 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] cursor-pointer overflow-hidden"
            >
              {/* Background Accent Decor */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform duration-700 group-hover:scale-150 ${theme.bg}`}
              />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Section 1: Job Info */}
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <span className="text-xl font-black text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {appliedJob.job?.company?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-[1000] text-slate-900 tracking-tight leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                      {appliedJob.job?.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500">
                        {appliedJob.job?.company?.name}
                      </span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                        <MapPin className="w-3 h-3" />
                        {appliedJob.job?.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Metadata & Status */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme.bg} ${theme.border} ${theme.color}`}
                  >
                    {theme.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                      {theme.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-tighter italic">
                      Applied {appliedJob.createdAt.split("T")[0]}
                    </span>
                  </div>
                </div>

                {/* Section 3: Action Indicator */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AppliedJobTable;
