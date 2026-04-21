import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT, BACKEND_BASE_URL } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  Search,
  BrainCircuit,
  Download,
  Filter,
} from "lucide-react";
import Footer from "../shared/Footer";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const [rankedApplicants, setRankedApplicants] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const [isRanking, setIsRanking] = useState(false);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true },
        );
        dispatch(setAllApplicants(res.data.applicants));
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchAllApplicants();
  }, [dispatch, params.id]);

  const handleRankApplicants = async () => {
    try {
      setIsRanking(true);
      // Simulating a slight delay for that "AI Thinking" feel
      const res = await axios.post(
        `${BACKEND_BASE_URL}/api/job/${params.id}/rank`,
      );

      const rankedData = res.data;

      let updated = applicants.map((a) => {
        const match = rankedData.find((r) => r.applicantId === a.applicant._id);
        return { ...a, score: match ? match.score : null };
      });

      updated.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

      let prev = null,
        rank = 0;
      updated = updated.map((a, i) => {
        if (a.score !== prev) rank = i + 1;
        prev = a.score;
        return { ...a, rank: a.score == null ? "N/A" : rank };
      });

      setRankedApplicants(updated);
      setShowRanking(true);
    } catch (err) {
      console.error("Ranking Error:", err);
    } finally {
      setIsRanking(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                <Users className="w-3 h-3" /> Talent Acquisition
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Manage Applicants
              </h1>
              <p className="text-slate-500 font-medium">
                Review and rank candidates for this position using{" "}
                <span className="text-slate-900 font-bold">
                  Velo-AI Analysis
                </span>
                .
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="outline"
                className="h-12 px-6 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>

              <Button
                onClick={handleRankApplicants}
                disabled={isRanking}
                className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                  showRanking
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-500/20"
                }`}
              >
                {isRanking ? (
                  <BrainCircuit className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {showRanking ? "Re-Run AI Ranking" : "Rank with Velo-AI"}
              </Button>
            </motion.div>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                label: "Total Applications",
                value: applicants.length,
                icon: <Users />,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "AI Ranked",
                value: showRanking ? rankedApplicants.length : 0,
                icon: <BrainCircuit />,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                label: "Top Talent",
                value: showRanking
                  ? rankedApplicants.filter((a) => a.rank <= 3).length
                  : 0,
                icon: <Sparkles />,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <h4 className="text-2xl font-black text-slate-900 leading-none">
                    {stat.value}
                  </h4>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
                >
                  {React.cloneElement(stat.icon, { className: "w-6 h-6" })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-3xl mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or skill..."
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-sm transition-all"
              />
            </div>
            <Button
              variant="ghost"
              className="h-12 px-6 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          {/* Table Workspace */}
          <motion.div
            layout
            className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showRanking ? "ranked" : "unranked"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ApplicantsTable
                  applicants={showRanking ? rankedApplicants : applicants}
                  showRanking={showRanking}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Applicants;
