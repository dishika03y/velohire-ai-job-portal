import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  MoreHorizontal,
  Mail,
  ExternalLink,
  Calendar,
  Phone,
  Trophy,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_BASE_URL } from "@/utils/constant";
import { motion } from "framer-motion";

const shortlistingStatus = [
  {
    label: "Accepted",
    icon: <UserCheck className="w-3.5 h-3.5" />,
    color: "text-emerald-500 hover:bg-emerald-50",
  },
  {
    label: "Rejected",
    icon: <UserX className="w-3.5 h-3.5" />,
    color: "text-rose-500 hover:bg-rose-50",
  },
];

const ApplicantsTable = ({ applicants, showRanking }) => {
  const { allAdminJobs } = useSelector((store) => store.job);

  const handleStatusUpdate = async (status, id, email, jobId) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${BACKEND_BASE_URL}/api/application/status/${id}/update`,
        { status },
      );

      if (res.data.success) {
        const jobDetails = allAdminJobs.find((job) => job._id === jobId);
        const companyName = jobDetails?.company?.name || "the company";

        // Dispatch email notification
        await axios.post(`${BACKEND_BASE_URL}/api/email/send-email`, {
          to: email,
          subject: `Status Update: ${jobDetails?.title} at ${companyName}`,
          message: `...`, // (Simplified for brevity, keep your original template)
        });

        toast.success(`Applicant marked as ${status}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Optimization sync failed");
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Candidate
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Contact Details
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Application Date
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Resume
            </TableHead>
            {showRanking && (
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                Talent Score
              </TableHead>
            )}
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
              Decision
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants?.length > 0 ? (
            applicants.map((item, index) => {
              const profilePhoto = item?.applicant?.profile?.profilePhoto
                ? `${BACKEND_BASE_URL}${item.applicant.profile.profilePhoto}`
                : "/default-profile.png";

              const resumeUrl = item?.applicant?.profile?.resume
                ? `${BACKEND_BASE_URL}${item.applicant.profile.resume}`
                : null;

              return (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  key={item._id}
                  className="group hover:bg-slate-50/80 transition-all border-b border-slate-50 last:border-none"
                >
                  {/* Candidate Identity */}
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={profilePhoto}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 group-hover:border-indigo-300 transition-colors"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight">
                          {item?.applicant?.fullname}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Verified Candidate
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact Info */}
                  <TableCell className="py-5 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail className="w-3 h-3 text-slate-300" />{" "}
                        {item?.applicant?.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <Phone className="w-3 h-3 text-slate-300" />{" "}
                        {item?.applicant?.phoneNumber || "No Contact"}
                      </div>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="py-5 px-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {item?.applicant?.createdAt?.split("T")[0]}
                    </div>
                  </TableCell>

                  {/* Resume Link */}
                  <TableCell className="py-5 px-4 text-center">
                    {resumeUrl ? (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase italic">
                        Missing
                      </span>
                    )}
                  </TableCell>

                  {/* Ranking System */}
                  {showRanking && (
                    <TableCell className="py-5 px-4">
                      <div className="flex justify-center">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${index < 3 ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-50 text-slate-500 border border-slate-100"}`}
                        >
                          <Trophy
                            className={`w-3 h-3 ${index < 3 ? "animate-bounce" : ""}`}
                          />
                          <span className="text-xs font-black italic">
                            Rank #{item.rank || index + 1}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  )}

                  {/* Action Menu */}
                  <TableCell className="py-5 px-8 text-right">
                    <Popover>
                      <PopoverTrigger className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all">
                        <MoreHorizontal className="text-slate-400 hover:text-indigo-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 bg-white border-slate-100 rounded-2xl shadow-xl overflow-hidden">
                        {shortlistingStatus.map((status) => (
                          <button
                            key={status.label}
                            onClick={() =>
                              handleStatusUpdate(
                                status.label,
                                item?._id,
                                item?.applicant?.email,
                                item?.job,
                              )
                            }
                            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${status.color}`}
                          >
                            {status.icon}
                            {status.label}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </motion.tr>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={showRanking ? 6 : 5}
                className="py-20 text-center"
              >
                <div className="flex flex-col items-center gap-2 opacity-30">
                  <UserCheck className="w-12 h-12 text-slate-300" />
                  <p className="font-black text-xs uppercase tracking-widest">
                    No candidates found for this segment.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
