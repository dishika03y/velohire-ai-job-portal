import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import {
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck,
  Globe,
  Zap,
} from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // LOGIC REMAINS UNTOUCHED
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please log in to apply!");
      return navigate("/login");
    }
    if (!user?.profile?.resume) {
      toast.error("Please upload your resume in your profile before applying!");
      return navigate("/profile");
    }
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const jobData = res.data.job;
          dispatch(setSingleJob(jobData));
          const hasApplied = jobData.applications.some(
            (app) => (app.applicant?._id || app.applicant) === user?._id,
          );
          setIsApplied(hasApplied);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleJob();
    return () => dispatch(setSingleJob(null));
  }, [jobId, dispatch, user?._id]);

  if (loading || !singleJob || singleJob._id !== jobId) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />

      {/* 1. ULTRA-MODERN HEADER SECTION */}
      <section className="pt-32 pb-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </motion.button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                  Active Hiring
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Ref ID: {singleJob?._id.slice(-6).toUpperCase()}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tight leading-[0.95] mb-6">
                {singleJob?.title}
              </h1>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600">
                    <Globe className="w-4 h-4" />
                  </div>
                  {singleJob?.location}
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  {singleJob?.jobType}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied}
                className={`h-16 px-8 rounded-2xl text-lg font-[1000] transition-all shadow-2xl active:scale-95 ${
                  isApplied
                    ? "bg-emerald-500 text-white cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100"
                }`}
              >
                {isApplied ? "Applied Successfully" : "Instant Apply"}
              </Button>
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest italic">
                {isApplied
                  ? "Our team will reach out shortly"
                  : "Typically responds in 24 hours"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRID CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: MISSION & REQUIREMENTS */}
        <div className="lg:col-span-8 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-indigo-600" /> About The Role
            </h3>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium tracking-tight">
              {singleJob?.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-indigo-600" /> Required Skills &
              Qualifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(singleJob?.requirements)
                ? singleJob?.requirements
                : singleJob?.requirements?.split(",") || []
              ).map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-5 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm leading-tight">
                    {req.trim ? req.trim() : req}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: DATA SIDEBAR */}
        <aside className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-32 p-8 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden shadow-3xl"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] pointer-events-none" />

            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-8 border-b border-white/10 pb-4">
              Role Parameters
            </h4>

            <div className="space-y-8">
              <DataRow
                icon={<Wallet />}
                label="Financial Comp"
                value={`${singleJob?.salary} LPA`}
              />
              <DataRow
                icon={<ShieldCheck />}
                label="Experience"
                value={`${singleJob?.experienceLevel} Years`}
              />
              <DataRow
                icon={<Users />}
                label="Applicants"
                value={singleJob?.applications?.length}
              />
              <DataRow
                icon={<Calendar />}
                label="Cycle Date"
                value={singleJob?.createdAt?.split("T")[0]}
              />
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                Fast-Track Role
              </p>
              <p className="text-xs text-slate-400 mt-2">
                This company typically reviews resumes within 48 hours.
              </p>
            </div>
          </motion.div>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

// Reusable Sub-component for Sidebar
const DataRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-lg font-bold tracking-tight">{value}</p>
    </div>
  </div>
);

export default JobDescription;
