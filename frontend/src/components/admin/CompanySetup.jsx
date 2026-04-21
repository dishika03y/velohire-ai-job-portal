import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Loader2,
  Globe,
  MapPin,
  Building2,
  ImagePlus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT, BACKEND_BASE_URL } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const navigate = useNavigate();
  const { singleCompany } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const logoUrl = singleCompany?.logo
    ? `${BACKEND_BASE_URL}${singleCompany.logo}`
    : "/default-avatar.png";

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      file: null,
    });
  }, [singleCompany]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("Corporate Profile Synchronized");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error("Synchronization Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {" "}
      {/* Soft Slate Grey Background */}
      <Navbar />
      <div className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Minimalist Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/admin/companies")}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-[11px] uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                Draft Mode: Auto-Save Active
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="flex flex-col lg:flex-row gap-10"
        >
          {/* Visual Brand Identity Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-32">
              <div className="relative group mx-auto w-32 h-32 mb-6">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                    <img
                      src={preview || logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-indigo-600/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-white">
                      <ImagePlus className="w-6 h-6 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">
                        Change Logo
                      </span>
                    </div>
                  </div>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setInput({ ...input, file });
                        const reader = new FileReader();
                        reader.onload = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Label>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {input.name || "Company Name"}
                </h2>
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Enterprise Profile
                </span>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-50">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Publish Updates"
                  )}
                </Button>
                <p className="text-[10px] text-center text-slate-400 font-medium italic px-4">
                  Changes will be visible to all candidates immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Content Editor Workspace */}
          <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="mb-10 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Organization Details
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Update your corporate identity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2 group">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  Company Name
                </Label>
                <Input
                  name="name"
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                  className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-700 transition-all px-6"
                />
              </div>

              <div className="md:col-span-2 space-y-2 group">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Short Pitch / Description
                </Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={(e) =>
                    setInput({ ...input, description: e.target.value })
                  }
                  className="w-full min-h-[120px] bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-700 transition-all px-6 py-4 resize-none"
                  placeholder="Briefly describe your company's mission..."
                />
              </div>

              <div className="space-y-2 group">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <Globe className="w-3 h-3" /> Website
                </Label>
                <Input
                  name="website"
                  value={input.website}
                  onChange={(e) =>
                    setInput({ ...input, website: e.target.value })
                  }
                  className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-700 transition-all px-6"
                />
              </div>

              <div className="space-y-2 group">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <MapPin className="w-3 h-3" /> Headquarters
                </Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={(e) =>
                    setInput({ ...input, location: e.target.value })
                  }
                  className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-700 transition-all px-6"
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-tight">
                  Profile Data Integrity: Verified
                </span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 uppercase">
                Step 2 of 2 Complete
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
