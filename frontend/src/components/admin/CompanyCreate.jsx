import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import {
  Building2,
  ArrowLeft,
  Sparkles,
  Rocket,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../shared/Footer";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();
  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-36 pb-20 px-6">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/admin/companies")}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-widest mb-12"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Directory
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                <Rocket className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
                Onboarding / Phase 01
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
              Register your <br />
              <span className="text-indigo-600">Organization</span>
            </h1>

            <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-sm">
              Enter your official company name. This is how you'll appear to
              candidates across the platform.
            </p>

            <div className="space-y-8">
              <div className="relative">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">
                  Company Name
                </Label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors z-10" />
                  <Input
                    type="text"
                    className="h-16 pl-12 bg-white border-slate-200 rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300 placeholder:font-medium shadow-sm"
                    placeholder="e.g. Acme Corp"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button
                  onClick={registerNewCompany}
                  className="h-14 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Create & Continue
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin/companies")}
                  className="h-14 px-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                      Verified Account
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Enterprise Ready
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Custom recruitment branding",
                    "Advanced talent analytics",
                    "Priority job indexing",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-slate-600">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Join 500+ Companies
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyCreate;
