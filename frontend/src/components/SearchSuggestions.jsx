import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase } from "lucide-react";

const SearchSuggestions = ({ query, type, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef(null);

  useEffect(() => {
    // 1. Setup AbortController to prevent race conditions
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/job/suggestions?query=${query}&type=${type}`,
          { signal: controller.signal },
        );
        setSuggestions(response.data);
        setShowSuggestions(response.data.length > 0);
        setActiveIndex(-1); // Reset keyboard focus
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Suggestions error:", error);
      }
    };

    // 2. Implement Debouncing
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [query, type]);

  // 3. Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && activeIndex !== -1) {
        onSelect(suggestions[activeIndex]);
        setShowSuggestions(false);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSuggestions, suggestions, activeIndex, onSelect]);

  // 4. Highlight the matching part of the string
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-indigo-600 font-black">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          className="absolute z-[100] mt-2 bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 border border-slate-200 rounded-2xl w-full overflow-hidden"
        >
          <div
            className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar"
            ref={scrollRef}
          >
            {suggestions.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                  activeIndex === index
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
                onClick={() => {
                  onSelect(item);
                  setShowSuggestions(false);
                }}
              >
                {/* Contextual Icons based on type */}
                <div
                  className={`p-1.5 rounded-lg ${activeIndex === index ? "bg-white shadow-sm" : "bg-slate-100"}`}
                >
                  {type === "location" ? (
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <span className="text-sm font-semibold truncate">
                  {highlightMatch(item, query)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Suggestions for {type}
            </span>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-sm">
                ↑↓
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-sm">
                ↵
              </kbd>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;
