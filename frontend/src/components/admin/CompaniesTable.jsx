import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Edit2,
  Building2,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "@/utils/constant";
import { motion } from "framer-motion";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company,
  );
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
    setFilteredCompanies(filtered);
  }, [companies, searchCompanyByText]);

  return (
    <div className="w-full overflow-hidden bg-slate-950 rounded-[2rem] border border-white/5 shadow-2xl">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="hover:bg-transparent border-b border-white/5">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Identity
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Corporate Name
            </TableHead>
            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Created At
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">
              Configuration
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => {
              const companyLogoUrl = company?.logo
                ? `${BACKEND_BASE_URL}${company.logo}`
                : "/default-logo.png";

              return (
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  key={company._id}
                  className="group border-b border-white/5 last:border-none hover:bg-indigo-500/[0.04] transition-all duration-500"
                >
                  {/* LOGO CELL */}
                  <TableCell className="py-6 px-8">
                    <div className="relative w-14 h-14 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500 shadow-inner">
                      <Avatar className="w-10 h-10 rounded-none">
                        <AvatarImage
                          src={companyLogoUrl}
                          alt={company.name}
                          className="object-contain filter brightness-110"
                        />
                      </Avatar>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TableCell>

                  {/* NAME CELL */}
                  <TableCell className="py-6 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-100 tracking-tight group-hover:text-indigo-400 transition-colors">
                          {company.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500/50 group-hover:text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-0.5">
                        Active Organization
                      </span>
                    </div>
                  </TableCell>

                  {/* DATE CELL */}
                  <TableCell className="py-6 px-4">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      {company.createdAt?.split("T")[0]}
                    </div>
                  </TableCell>

                  {/* ACTION CELL */}
                  <TableCell className="py-6 px-8 text-right">
                    <button
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="group/btn relative inline-flex items-center gap-2 bg-slate-900 border border-white/10 px-5 py-2.5 rounded-xl text-[11px] font-black text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all active:scale-95 overflow-hidden"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>EDIT PROFILE</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-all" />
                      {/* Glow Effect on Hover */}
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </TableCell>
                </motion.tr>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="h-72 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-[2rem] border border-white/5 flex items-center justify-center animate-pulse">
                    <Building2 className="w-10 h-10 text-slate-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-black uppercase tracking-widest">
                      No Results Found
                    </p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                      Try adjusting your search filters
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
