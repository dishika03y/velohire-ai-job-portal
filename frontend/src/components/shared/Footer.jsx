import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  ArrowUpRight,
  Mail,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: ["Browse Jobs", "Companies", "Remote Hub", "Salaries"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Careers", "Press"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];

  return (
    <footer className="relative bg-[#020617] pt-24 pb-12 overflow-hidden">
      {/* VIBRANT GLOW: Mirroring the hero section but in dark mode. 
          This prevents the footer from looking "flat".
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-200" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Upper Footer: CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
            >
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                New Opportunities Weekly
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-[1000] tracking-tight text-white mb-8 leading-[1.1]"
            >
              Ready to land your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                next big role?
              </span>
            </motion.h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="group flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/20"
              >
                Start for Free{" "}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-400 font-semibold hover:text-white transition-colors text-sm md:text-base"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with subtle shimmer */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-12" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-[1000] tracking-tighter text-white">
              Job<span className="text-indigo-500">veloHire</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-600 mt-2 uppercase tracking-[0.2em]">
              © {currentYear} PRAV Company • Professional Grade Hiring
            </p>
          </div>

          {/* Socials - Glassmorphism style */}
          <div className="flex gap-3">
            {[
              { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
              { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
              { icon: <Github className="w-5 h-5" />, label: "Github" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{
                  y: -5,
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  borderColor: "rgba(99, 102, 241, 0.4)",
                }}
                className="w-12 h-12 flex items-center justify-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all shadow-xl"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
