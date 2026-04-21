import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RotateCcw, MapPin, Briefcase } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    icon: <MapPin className="w-4 h-4" />,
    array: ["Indore", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    icon: <Briefcase className="w-4 h-4" />,
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "Data Scientist",
    ],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  const clearFilters = () => {
    setSelectedValue("");
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full bg-white border border-slate-200 shadow-sm rounded-[2rem] overflow-hidden sticky top-24"
    >
      {/* Header Section */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-black text-slate-800 tracking-tight">
            Filter Jobs
          </h1>
        </div>

        <AnimatePresence>
          {selectedValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-50 transition-all"
              title="Clear All"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Content */}
      <div className="p-6">
        <RadioGroup
          value={selectedValue}
          onValueChange={changeHandler}
          className="space-y-8"
        >
          {filterData.map((data, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400">{data.icon}</span>
                <h1 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  {data.filterType}
                </h1>
              </div>

              <div className="grid gap-2">
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  const isSelected = selectedValue === item;

                  return (
                    <motion.div
                      key={itemId}
                      whileHover={{ x: 4 }}
                      className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-200 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-slate-50"
                      }`}
                    >
                      <RadioGroupItem
                        value={item}
                        id={itemId}
                        className="border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label
                        htmlFor={itemId}
                        className={`cursor-pointer w-full text-sm font-bold transition-colors ${
                          isSelected ? "text-indigo-700" : "text-slate-600"
                        }`}
                      >
                        {item}
                      </Label>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Visual Footer Polish */}
      <div className="p-6 pt-0">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-tight text-center">
            Showing best matches based on your selection.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterCard;
