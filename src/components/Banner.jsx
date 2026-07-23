"use client";

import Link from "next/link";
import React, { useState } from "react";
import { 
  HiOutlineLocationMarker, 
  HiOutlineCalendar, 
  HiOutlineCurrencyDollar, 
  HiOutlineUsers, 
  HiSearch,
  HiSparkles,
  HiOutlineArrowNarrowRight
} from "react-icons/hi";

const Banner = () => {
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("anytime");
  const [budget, setBudget] = useState("all");
  const [people, setPeople] = useState("2");

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between items-center overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-4 border border-white/10 shadow-2xl">
      
      {/* Background Image & Ambient Mesh Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/assets/Banner.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-slate-950/60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-12 text-center flex flex-col items-center gap-6 my-auto">
        
        {/* Animated Glossy Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg shadow-cyan-500/10">
          <HiSparkles className="text-cyan-400 animate-pulse text-base" />
          <span>Discover Your Next Extraordinary Adventure</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
          Unveil The World's <br />
          <span className="text-gradient-cyan">Hidden Wonders</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
          Curated luxury expeditions, breath-taking sanctuaries, and bespoke travel memories crafted tailored to your spirit.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
          <Link
            href="/destinations"
            className="glossy-btn px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-3 group shadow-xl shadow-cyan-500/20"
          >
            <span>Explore Destinations</span>
            <HiOutlineArrowNarrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#featured-destinations"
            className="px-8 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white font-semibold text-base border border-white/15 hover:border-white/30 hover:bg-white/10 transition-all backdrop-blur-md"
          >
            View Highlights
          </Link>
        </div>
      </div>

      {/* Floating Glass Search Bar */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-6 sm:pb-8">
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* Location Field */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-input">
              <HiOutlineLocationMarker className="text-cyan-400 text-2xl flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Location</span>
                <input
                  type="text"
                  placeholder="Where to next?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none placeholder-slate-400 truncate"
                />
              </div>
            </div>

            {/* Date / Duration Field */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-input">
              <HiOutlineCalendar className="text-cyan-400 text-2xl flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Duration</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none cursor-pointer"
                >
                  <option value="anytime" className="bg-slate-900 text-white">Anytime</option>
                  <option value="3days" className="bg-slate-900 text-white">1 - 3 Days</option>
                  <option value="7days" className="bg-slate-900 text-white">4 - 7 Days</option>
                  <option value="14days" className="bg-slate-900 text-white">8 - 14 Days</option>
                </select>
              </div>
            </div>

            {/* Budget Field */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-input">
              <HiOutlineCurrencyDollar className="text-cyan-400 text-2xl flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Budget</span>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Budgets</option>
                  <option value="under500" className="bg-slate-900 text-white">Under $500</option>
                  <option value="500-1500" className="bg-slate-900 text-white">$500 - $1,500</option>
                  <option value="luxury" className="bg-slate-900 text-white">$1,500+</option>
                </select>
              </div>
            </div>

            {/* Travelers / Guests Field */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-input">
              <HiOutlineUsers className="text-cyan-400 text-2xl flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Guests</span>
                <select
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none cursor-pointer"
                >
                  <option value="1" className="bg-slate-900 text-white">1 Solo Explorer</option>
                  <option value="2" className="bg-slate-900 text-white">2 Couples / Pair</option>
                  <option value="4" className="bg-slate-900 text-white">3-5 Family</option>
                  <option value="group" className="bg-slate-900 text-white">6+ Large Group</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Link
              href={`/destinations${location ? `?search=${encodeURIComponent(location)}` : ""}`}
              className="glossy-btn w-full h-full min-h-[52px] rounded-2xl flex items-center justify-center gap-2 text-base font-bold text-white shadow-lg shadow-cyan-500/25 sm:col-span-2 lg:col-span-1"
            >
              <HiSearch className="text-xl" />
              <span>Search Tours</span>
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Banner;
