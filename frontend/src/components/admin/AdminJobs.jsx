import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { Plus, Search, Briefcase, Filter } from "lucide-react";
import Footer from "../shared/Footer";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (<>
    <div className="min-h-screen bg-[#FAFBFC] pb-20">
      <Navbar />

      {/* Hero Header Section */}
      <div className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
              Employer Console
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight">
              Manage <span className="text-indigo-600">Jobs.</span>
            </h1>
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-slate-900 hover:bg-indigo-600 text-white px-6 h-12 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <Plus className="w-5 h-5" />
              Post New Role
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-4 items-center mb-10"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              className="w-full pl-12 h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl font-medium text-slate-700 placeholder:text-slate-400"
              placeholder="Search by company, role, or keywords..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </motion.div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <AdminJobsTable />
        </motion.div>
      </div>
      
    </div>
    <footer>
        <Footer />
      </footer></>
  );
};

export default AdminJobs;
