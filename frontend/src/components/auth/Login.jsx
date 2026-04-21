import React, { useEffect, useState } from "react";
import Logo from "../ui/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import {
  Loader2,
  Mail,
  Lock,
  Sparkles,
  Briefcase,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [focusedInput, setFocusedInput] = useState(null);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) return toast.error("Please select your role to continue");

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="h-screen bg-[#F4F4F9] flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Main container restricted to available height */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[1200px] h-full max-h-[720px] grid lg:grid-cols-12 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          {/* Left Side: Visual Experience */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-[#0A0A0A] text-white relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md cursor-default"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                <span className="text-[10px] font-bold tracking-widest text-indigo-100 uppercase">
                  Join 50,000+ Professionals
                </span>
              </motion.div>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Your next big <br />
                career move, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  accelerated.
                </span>
              </h2>
            </div>

            <div className="relative z-10">
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Unlock top-tier opportunities and connect with world-class teams
                using our AI-driven matchmaking.
              </p>
            </div>
          </div>

          {/* Right Side: Optimized Form */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center p-8 md:p-12 relative bg-white/40 overflow-y-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-[400px] relative z-10"
            >
              {/* Logo Visibility Fix */}
              <motion.div
                variants={itemVariants}
                className="mb-6 flex justify-center lg:justify-start"
              >
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <Logo />
                </div>
              </motion.div>

              <div className="mb-8 text-center lg:text-left">
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl font-black tracking-tight text-slate-900"
                >
                  Welcome back
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-slate-500 mt-1 text-sm"
                >
                  Enter your credentials to access your dashboard.
                </motion.p>
              </div>

              <form onSubmit={submitHandler} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
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
                      placeholder="name@company.com"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <Link
                      to="#"
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
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
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white/60 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                    />
                  </div>
                </motion.div>

                {/* Compact Role Selection */}
                <motion.div variants={itemVariants} className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Continue as
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/50 p-1 rounded-xl">
                    {["Job Seeker", "Employer"].map((role) => {
                      const isSelected = input.role === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setInput({ ...input, role })}
                          className={`relative flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold uppercase transition-all ${isSelected ? "text-indigo-700" : "text-slate-500 hover:bg-white/50"}`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeRole"
                              className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                            {role === "Employer" ? (
                              <Briefcase className="w-3.5 h-3.5" />
                            ) : (
                              <UserCircle className="w-3.5 h-3.5" />
                            )}
                            {role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold text-sm flex items-center justify-center transition-all mt-4 hover:shadow-lg disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in to Dashboard <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-slate-500 font-medium text-xs mt-4"
                >
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Sign up for free
                  </Link>
                </motion.p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
