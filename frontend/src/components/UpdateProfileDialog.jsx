import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Loader2,
  X,
  User,
  Phone,
  BookOpen,
  Cpu,
  FileUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(input.phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[500px] p-0 bg-transparent border-none shadow-none"
        onInteractOutside={() => setOpen(false)}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_32px_80px_-20px_rgba(79,70,229,0.15)] rounded-[2.5rem] overflow-hidden"
            >
              {/* Header Section */}
              <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-[1000] tracking-tight">
                    Refine Your Identity
                  </h2>
                  <p className="text-indigo-100 font-medium text-sm mt-1">
                    Keep your professional persona up to date.
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={submitHandler} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Contact Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-indigo-500 focus-visible:bg-white transition-all font-bold text-slate-700"
                        placeholder="Enter 10 digit number"
                      />
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Professional Bio
                    </Label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input
                        name="bio"
                        value={input.bio}
                        onChange={changeEventHandler}
                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-indigo-500 focus-visible:bg-white transition-all font-bold text-slate-700"
                        placeholder="Tell your story..."
                      />
                    </div>
                  </div>

                  {/* Skills Field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Core Skills (Comma separated)
                    </Label>
                    <div className="relative group">
                      <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input
                        name="skills"
                        value={input.skills}
                        onChange={changeEventHandler}
                        className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-indigo-500 focus-visible:bg-white transition-all font-bold text-slate-700"
                        placeholder="React, Node, Python..."
                      />
                    </div>
                  </div>

                  {/* File Upload Component */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Update Resume (PDF)
                    </Label>
                    <label className="flex items-center justify-between p-4 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                          <FileUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 truncate max-w-[200px]">
                          {input.file ? input.file.name : "Select new resume"}
                        </span>
                      </div>
                      {input.file ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter bg-white px-2 py-1 rounded-lg border border-indigo-100">
                          Upload
                        </span>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={fileChangeHandler}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Synchronizing...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
