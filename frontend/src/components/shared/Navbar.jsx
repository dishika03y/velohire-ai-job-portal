import React, { useState, useEffect } from "react";
import { LogOut, User2, ChevronDown, Menu, X, Bell, Zap } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT, BACKEND_BASE_URL } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../ui/Logo";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  const profilePhotoUrl = user?.profile?.profilePhoto
    ? `${BACKEND_BASE_URL}${user.profile.profilePhoto}`
    : "https://github.com/shadcn.png";

  const navLinks =
    user?.role === "Employer"
      ? [
          { name: "Dashboard", path: "/admin/companies" },
          { name: "Manage Jobs", path: "/admin/jobs" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Explore Jobs", path: "/jobs" },
          { name: "Browse", path: "/browse" },
        ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 flex justify-center ${
        scrolled ? "py-4 px-6" : "py-6 px-10"
      }`}
    >
      <div
        className={`w-full max-w-[1440px] transition-all duration-500 flex items-center justify-between px-10 ${
          scrolled
            ? "h-20 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-[2rem]"
            : "h-24 bg-transparent border-b border-transparent"
        }`}
      >
        <Logo></Logo>

        {/* Desktop Navigation - Increased Gaps */}
        <div className="hidden lg:flex items-center gap-12">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-base font-extrabold transition-all hover:text-indigo-600 relative py-2 ${
                    location.pathname === link.path
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-indigo-600 rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-8 w-[2px] bg-slate-100 mx-2" />

          {!user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-base font-extrabold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-slate-900 text-white text-base font-extrabold px-10 py-4 rounded-2xl hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Join Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button className="relative p-3 text-slate-400 hover:text-indigo-600 transition-colors group">
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
              </button>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:shadow-md transition-all"
                >
                  <img
                    src={profilePhotoUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
                  />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[13px] font-black text-slate-900 truncate max-w-[100px]">
                      {user?.fullname.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                  />
                </motion.div>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[2rem] overflow-hidden p-3"
                    >
                      <div className="p-4 mb-3 bg-slate-50/50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                          Account
                        </p>
                        <p className="font-black text-slate-900 truncate text-lg">
                          {user?.fullname}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {user.role === "Job Seeker" && (
                          <Link
                            to="/profile"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all group"
                          >
                            <User2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-extrabold">
                              View Profile
                            </span>
                          </Link>
                        )}

                        <button
                          onClick={logoutHandler}
                          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all group"
                        >
                          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          <span className="text-sm font-extrabold">
                            Logout Session
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Larger Hit Area */}
        <button
          className="lg:hidden p-3 text-slate-900 bg-slate-100 rounded-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
