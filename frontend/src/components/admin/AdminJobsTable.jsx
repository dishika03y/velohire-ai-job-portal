import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Building2,
  Search,
  Briefcase,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteJob } from "@/redux/jobSlice";
import axios from "axios";
import { JOB_API_END_POINT, BACKEND_BASE_URL } from "@/utils/constant";
import { motion, AnimatePresence } from "framer-motion";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [filterJobs, setFilterJobs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Employer") {
      const employerJobs = allAdminJobs.filter(
        (job) => job.created_by === user._id,
      );

      const filteredJobs = employerJobs.filter((job) => {
        if (!searchJobByText) return true;
        return (
          job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });

      setFilterJobs(filteredJobs);
    }
  }, [allAdminJobs, searchJobByText, user]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(deleteJob(jobId));
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Company
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Job Role
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Location
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Post Date
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
              Operations
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {filterJobs?.length > 0 ? (
              filterJobs.map((job, index) => {
                const companyLogo = job?.company?.logo
                  ? `${BACKEND_BASE_URL}${job.company.logo}`
                  : "/default-company-logo.png";

                return (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-slate-50/80 transition-all border-b border-slate-50 last:border-none"
                  >
                    {/* Company Info */}
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={companyLogo}
                            alt="Logo"
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 group-hover:border-indigo-300 transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">
                            {job?.company?.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Verified Entity
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Info */}
                    <TableCell className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight">
                          {job?.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                          <Briefcase className="w-3 h-3" /> Active Hire
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-5 px-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        {job?.location}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-5 px-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {job?.createdAt?.split("T")[0]}
                      </div>
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants`)
                          }
                          className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group/btn"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Applicants</span>
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Building2 className="w-14 h-14 text-slate-300" />
                    <p className="font-black text-xs uppercase tracking-[0.2em]">
                      No active job listings found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
