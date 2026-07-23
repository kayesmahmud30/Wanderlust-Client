"use client";

import DestinationCard from "@/components/DestinationCard";
import React, { useState, useMemo } from "react";
import { HiSearch, HiOutlineFilter, HiOutlineRefresh, HiChevronDown } from "react-icons/hi";

const categories = [
  "All Categories",
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Luxury",
];

const DestinationsClientView = ({ initialDestinations = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredDestinations = useMemo(() => {
    return initialDestinations.filter((dest) => {
      const matchesSearch =
        dest.destinationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        dest.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialDestinations, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      
      {/* Search & Category Dropdown Controls */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-xl pointer-events-none" />
          <input
            type="text"
            placeholder="Search by destination or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-12 pr-4 py-3 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-lg pointer-events-none">
            <HiOutlineFilter />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full glass-input pl-11 pr-10 py-3 rounded-2xl text-sm font-semibold text-white focus:outline-none cursor-pointer appearance-none bg-no-repeat"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white font-medium py-2">
                {cat === "All Categories" ? "🏷️ All Categories" : `🏝️ ${cat}`}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <HiChevronDown className="text-lg" />
          </div>
        </div>

      </div>

      {/* Grid Results Count & Active Filter Reset */}
      <div className="flex items-center justify-between text-sm text-slate-400 font-medium px-2">
        <span>
          Showing <strong className="text-white">{filteredDestinations.length}</strong> destinations
          {selectedCategory !== "All Categories" && (
            <span className="ml-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Filter: {selectedCategory}
            </span>
          )}
        </span>

        {(searchTerm || selectedCategory !== "All Categories") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All Categories");
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
          >
            <HiOutlineRefresh /> Reset Filters
          </button>
        )}
      </div>

      {/* Destination Cards Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl text-center border border-white/10 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto text-3xl">
            <HiOutlineFilter />
          </div>
          <h3 className="text-xl font-bold text-white">No destinations match your criteria</h3>
          <p className="text-slate-400 text-sm">
            Try adjusting your search terms or selecting a different category from the dropdown menu.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All Categories");
            }}
            className="glossy-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default DestinationsClientView;
