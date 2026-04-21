import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  FileText,
  ExternalLink,
  Briefcase,
  Award,
  Sparkles,
  Phone,
} from "lucide-react";
import { Badge } from "./ui/badge";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { BACKEND_BASE_URL } from "@/utils/constant";
import { motion } from "framer-motion";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const profilePhotoUrl = user?.profile?.profilePhoto
    ? `${BACKEND_BASE_URL}${user.profile.profilePhoto}`
    : "";

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 selection:bg-indigo-100">
      <Navbar />

      {/* 1. INCREASED TOP PADDING (pt-32) FOR BREATHING ROOM */}
      <div className="pt-32 max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative shadow-2xl shadow-indigo-500/5 rounded-[3rem] bg-white border border-slate-200/50 overflow-hidden"
        >
          {/* 2. PREMIUM MESH BANNER (Replaces the flat blue) */}
          <div className="relative h-56 w-full overflow-hidden bg-slate-900">
            {/* Animated Mesh Gradients */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[20%] -left-[10%] w-[70%] h-[140%] rounded-full bg-indigo-600/40 blur-[100px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -40, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[120%] rounded-full bg-violet-500/30 blur-[100px]"
            />

            {/* Grain/Noise Texture for that "High-End" feel */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="absolute top-8 left-8">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-white/90" />
              </div>
            </div>
          </div>

          <div className="px-10 pb-12">
            {/* 3. OVERLAPPING AVATAR & IDENTITY */}
            <div className="flex flex-col md:flex-row justify-between items-end -mt-20 gap-8">
              <div className="flex flex-col md:flex-row items-end gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-44 w-44 border-[8px] border-white shadow-2xl rounded-[3.5rem] bg-slate-50">
                    <AvatarImage
                      src={profilePhotoUrl}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-200 text-indigo-600 font-black text-4xl">
                      {user?.fullname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="mb-4">
                  <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight leading-none mb-3">
                    {user?.fullname}
                  </h1>
                  <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100/50">
                    {user?.profile?.bio || "Product Designer & Engineer"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setOpen(true)}
                className="mb-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 px-8 py-7 h-auto font-bold transition-all active:scale-95"
              >
                <Pen className="w-4 h-4 mr-3" />
                Update Profile
              </Button>
            </div>

            {/* 4. REFINED INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <div className="group flex items-center gap-5 p-7 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/80 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Official Email
                  </p>
                  <p className="text-base font-bold text-slate-800">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="group flex items-center gap-5 p-7 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/80 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Contact Number
                  </p>
                  <p className="text-base font-bold text-slate-800">
                    {user?.phoneNumber || "+91 00000 00000"}
                  </p>
                </div>
              </div>
            </div>

            {/* --- CORE PROFICIENCIES (Remains same but with better spacing) --- */}
            <div className="mt-16">
              <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                <Award className="w-5 h-5" />
                <span className="w-8 h-[2px] bg-indigo-100" />
                Core Proficiencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {user?.profile?.skills?.map((item, index) => (
                  <Badge
                    key={index}
                    className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 font-bold text-xs transition-all shadow-sm"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- ACTIVITY SECTION --- */}
        <div className="mt-24">
          <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight mb-10 px-2 flex items-center gap-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
            Application History
          </h2>
          <div className="bg-white border border-slate-200/60 rounded-[3rem] p-8 shadow-sm">
            <AppliedJobTable />
          </div>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
