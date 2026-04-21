import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Plus, Search, Building2, LayoutGrid, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../shared/Footer";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  const handleCreateCompany = () => {
    navigate("/admin/companies/create");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <div className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
              <Sparkles className="w-3 h-3" /> Admin Console
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Company <span className="text-indigo-500">Directory</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-2 max-w-md">
              Oversee your corporate ecosystem and manage entity details from a
              centralized hub.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                className="w-full md:w-[300px] pl-11 h-12 bg-slate-200/50 border-slate-300 text-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 placeholder:text-slate-500 transition-all"
                placeholder="Search entities..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateCompany}
              className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-bold uppercase text-[10px] tracking-widest"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              New Entity
            </Button>
          </motion.div>
        </div>

        {/* Database Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0F172A] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Table Toolbar */}
          <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  Live Database
                </span>
                <span className="block text-[9px] font-bold text-slate-500 uppercase">
                  Real-time sync active
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                System Health: Optimal
              </span>
            </div>
          </div>

          <div className="p-4">
            {/* Note: Ensure CompaniesTable uses dark mode classes for its cells/rows */}
            <CompaniesTable />
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Companies;
