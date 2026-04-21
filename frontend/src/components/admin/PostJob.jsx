import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  Briefcase,
  AlignLeft,
  ListChecks,
  MapPin,
  Layers,
  Clock,
  Users,
  Building2,
  Sparkles,
  Banknote,
} from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryMin: 0,
    salaryMax: 50,
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const SALARY_MAX = 50;

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (["experience", "position"].includes(name)) {
      if (value === "" || /^\d+$/.test(value)) {
        setInput({ ...input, [name]: value });
      }
    } else if (["salaryMin", "salaryMax"].includes(name)) {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        setInput({ ...input, [name]: name === "salaryMin" ? 0 : SALARY_MAX });
      } else if (
        name === "salaryMin" &&
        numValue <= input.salaryMax &&
        numValue >= 0
      ) {
        setInput({ ...input, [name]: numValue });
      } else if (
        name === "salaryMax" &&
        numValue >= input.salaryMin &&
        numValue <= SALARY_MAX
      ) {
        setInput({ ...input, [name]: numValue });
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const selectChangeHandler = (name) => (value) => {
    if (name === "companyId") {
      const selectedCompany = companies.find(
        (company) => company.name.toLowerCase() === value,
      );
      setInput({ ...input, companyId: selectedCompany?._id || "" });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.jobType) return toast.error("Please select a job type");
    if (!input.experience || parseInt(input.experience) < 0)
      return toast.error("Please enter a valid experience level");
    if (!input.position || parseInt(input.position) < 1)
      return toast.error("Please enter a valid number of positions");
    if (input.salaryMin > input.salaryMax)
      return toast.error("Minimum salary cannot exceed maximum");

    const min = parseInt(input.salaryMin, 10);
    const max = parseInt(input.salaryMax, 10);

    if (isNaN(min) || isNaN(max))
      return toast.error("Invalid salary range detected");

    const salary = min === max ? `${min}` : `${min}-${max}`;
    const payload = { ...input, salary };
    delete payload.salaryMin;
    delete payload.salaryMax;

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Dark theme input styles
  const inputStyles =
    "w-full h-12 px-5 bg-[#1E293B] border-slate-700 rounded-xl focus:bg-[#0F172A] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm text-white transition-all placeholder:text-slate-500 placeholder:font-medium";

  return (
    // UPDATED: Dark background
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar />

      {/* UPDATED: max-w-3xl to make the card smaller */}
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Job Requisition
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
            Create New Position
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">
            Define the role and compensation to attract top-tier talent.
          </p>
        </motion.div>

        {/* UPDATED: Dark Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0F172A] rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden"
        >
          <form onSubmit={submitHandler} className="p-8 md:p-10">
            {/* Section 1: Role Details */}
            <div className="mb-10">
              <h3 className="text-md font-black text-white tracking-tight mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                  1
                </span>
                Role Definition
              </h3>
              <div className="space-y-6">
                <div>
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    <Briefcase className="w-3.5 h-3.5" /> Job Title
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    value={input.title}
                    onChange={changeEventHandler}
                    className={inputStyles}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                      <AlignLeft className="w-3.5 h-3.5" /> Description
                    </Label>
                    <textarea
                      name="description"
                      value={input.description}
                      onChange={changeEventHandler}
                      className={`${inputStyles} h-28 py-4 resize-none`}
                      placeholder="Brief overview..."
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                      <ListChecks className="w-3.5 h-3.5" /> Requirements
                    </Label>
                    <textarea
                      name="requirements"
                      value={input.requirements}
                      onChange={changeEventHandler}
                      className={`${inputStyles} h-28 py-4 resize-none`}
                      placeholder="Key skills..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-800 mb-10" />

            {/* Section 2: Logistics & Compensation */}
            <div className="mb-10">
              <h3 className="text-md font-black text-white tracking-tight mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                  2
                </span>
                Logistics & Compensation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className={inputStyles}
                    placeholder="e.g. Remote"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    <Clock className="w-3.5 h-3.5" /> Job Type
                  </Label>
                  <Select
                    onValueChange={selectChangeHandler("jobType")}
                    value={input.jobType}
                  >
                    <SelectTrigger className={inputStyles}>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-slate-700 text-white rounded-xl">
                      <SelectGroup>
                        <SelectItem
                          value="Full-Time"
                          className="focus:bg-indigo-600 focus:text-white"
                        >
                          Full-Time
                        </SelectItem>
                        <SelectItem
                          value="Part-Time"
                          className="focus:bg-indigo-600 focus:text-white"
                        >
                          Part-Time
                        </SelectItem>
                        <SelectItem
                          value="Intern"
                          className="focus:bg-indigo-600 focus:text-white"
                        >
                          Intern
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    <Layers className="w-3.5 h-3.5" /> Experience
                  </Label>
                  <Input
                    type="number"
                    name="experience"
                    value={input.experience}
                    onChange={changeEventHandler}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    <Users className="w-3.5 h-3.5" /> Positions
                  </Label>
                  <Input
                    type="number"
                    name="position"
                    value={input.position}
                    onChange={changeEventHandler}
                    className={inputStyles}
                  />
                </div>

                <div className="md:col-span-2 bg-[#1E293B] rounded-2xl p-6 border border-slate-700 mt-2">
                  <Label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                    <span className="flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5" /> Salary Range (LPA)
                    </span>
                    <span className="bg-[#0F172A] px-3 py-1 rounded-lg border border-slate-700 text-indigo-400">
                      {input.salaryMin}L - {input.salaryMax}L
                    </span>
                  </Label>
                  <div className="relative pt-2 pb-4">
                    <input
                      type="range"
                      name="salaryMin"
                      min="0"
                      max={SALARY_MAX}
                      value={input.salaryMin}
                      onChange={changeEventHandler}
                      className="absolute w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 pointer-events-auto"
                      style={{
                        zIndex: input.salaryMin > SALARY_MAX - 5 ? "5" : "3",
                      }}
                    />
                    <input
                      type="range"
                      name="salaryMax"
                      min="0"
                      max={SALARY_MAX}
                      value={input.salaryMax}
                      onChange={changeEventHandler}
                      className="absolute w-full h-1.5 bg-transparent rounded-lg appearance-none cursor-pointer accent-indigo-500 pointer-events-auto"
                      style={{ zIndex: "4" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || companies.length === 0}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Publish Requisition"
              )}
            </Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
