import React, { useEffect, useState } from "react";
import Logo from "../ui/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Phone,
  Image as ImageIcon,
  Briefcase,
  UserCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [preview, setPreview] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) return toast.error("Please select your role");

    const formData = new FormData();
    Object.keys(input).forEach((key) => formData.append(key, input[key]));

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F4F4F9] flex flex-col overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1300px] grid lg:grid-cols-12 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden"
        >
          {/* Left Side: Brand Experience */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-[#0A0A0A] text-white relative overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative z-10">
              {/* FIXED LOGO VISIBILITY: Added bright container and backdrop blur */}
              <div className="bg-white p-3 rounded-2xl border border-white/20 shadow-xl inline-flex mb-12">
                <Logo />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-indigo-400 mr-2 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest text-indigo-100 uppercase">
                    Build your future
                  </span>
                </div>
                <h2 className="text-5xl font-extrabold leading-tight mb-6">
                  Ready to start <br />
                  your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    veloHire?
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                  Join a community where talent meets opportunity through
                  intelligent, high-speed matching.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm">
              <p className="text-sm italic text-slate-300">
                "The fastest way to land a top-tier role in the modern market."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Tech Lead
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                    Verified Professional
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 md:p-16 relative bg-white/30">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-[580px] mx-auto"
            >
              <div className="mb-10 text-center lg:text-left">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-black text-slate-900 tracking-tight"
                >
                  Create Account
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-slate-500 mt-2 text-lg"
                >
                  Fill in your details to get started.
                </motion.p>
              </div>

              <form onSubmit={submitHandler} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedInput === "fullname" ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <input
                        type="text"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeEventHandler}
                        onFocus={() => setFocusedInput("fullname")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="John Doe"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedInput === "email" ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="john@example.com"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                      Phone
                    </label>
                    <div className="relative group">
                      <Phone
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedInput === "phone" ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        onFocus={() => setFocusedInput("phone")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedInput === "password" ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                    I am registering as
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-slate-100/50 p-1 rounded-xl relative">
                    {["Job Seeker", "Employer"].map((r) => {
                      const isSelected = input.role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setInput({ ...input, role: r })}
                          className={`relative flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all z-10 ${
                            isSelected
                              ? "text-indigo-700 font-bold"
                              : "text-slate-500 font-medium hover:text-slate-700"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeRoleSignup"
                              className="absolute inset-0 bg-white rounded-lg shadow-sm"
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                              }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2 text-xs uppercase tracking-wider">
                            {r === "Employer" ? (
                              <Briefcase className="w-3.5 h-3.5" />
                            ) : (
                              <UserCircle className="w-3.5 h-3.5" />
                            )}
                            {r}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                    Profile Avatar
                  </label>
                  <div className="relative group h-[56px]">
                    <div
                      className={`flex items-center h-full rounded-xl border-2 border-dashed transition-all px-4 ${input.file ? "border-green-400 bg-green-50/30" : "border-slate-200 hover:border-indigo-400 bg-white/60"}`}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-8 h-8 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400 mr-3" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">
                          {input.file ? input.file.name : "Select your photo"}
                        </span>
                      </div>
                      {input.file && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="relative w-full overflow-hidden bg-slate-900 text-white rounded-xl h-14 font-bold text-lg flex items-center justify-center transition-all group disabled:opacity-70 shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    {loading ? (
                      <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                      "Create My Account"
                    )}
                  </button>

                  <p className="text-center mt-6 text-slate-500 font-medium text-sm">
                    Already part of the voyage?{" "}
                    <Link
                      to="/login"
                      className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Signup;
