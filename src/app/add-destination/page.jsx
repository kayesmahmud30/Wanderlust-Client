"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  HiOutlinePlusCircle, 
  HiOutlineLocationMarker, 
  HiOutlineGlobe, 
  HiOutlineTag, 
  HiOutlineCurrencyDollar, 
  HiOutlineCalendar, 
  HiOutlinePhotograph, 
  HiOutlineDocumentText,
  HiSparkles
} from "react-icons/hi";

const categories = ["Beach", "Mountain", "City", "Adventure", "Cultural", "Luxury"];

const AddDestinationPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Beach");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const destination = Object.fromEntries(formData.entries());
      destination.category = category;
      destination.price = Number(destination.price);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(destination),
        }
      );

      if (res.ok) {
        toast.success("✨ Destination package added successfully!");
        router.push("/destinations");
      } else {
        const data = await res.json();
        toast.error(data?.message || "Failed to create destination");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-flex items-center gap-1.5">
          <HiSparkles /> Admin Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Add New <span className="text-gradient-cyan">Destination</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Publish a new luxury getaway or adventure package to the Wanderlust global catalog.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
        <form onSubmit={onSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Destination Name */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineLocationMarker className="text-cyan-400 text-base" />
                Destination Name
              </label>
              <input
                type="text"
                name="destinationName"
                placeholder="e.g. Bali Tropical Paradise Sanctuary"
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineGlobe className="text-cyan-400 text-base" />
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="e.g. Indonesia"
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineTag className="text-cyan-400 text-base" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (USD) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineCurrencyDollar className="text-cyan-400 text-base" />
                Price per Person (USD)
              </label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 1499"
                required
                min="1"
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineCalendar className="text-cyan-400 text-base" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 7 Days / 6 Nights"
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Departure Date */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineCalendar className="text-cyan-400 text-base" />
                Scheduled Departure Date
              </label>
              <input
                type="date"
                name="departureDate"
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlinePhotograph className="text-cyan-400 text-base" />
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineDocumentText className="text-cyan-400 text-base" />
                Experience Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the unique features, activities, and highlights of this package..."
                required
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glossy-btn py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 disabled:opacity-50"
          >
            {loading ? (
              <span>Publishing Destination...</span>
            ) : (
              <>
                <HiOutlinePlusCircle className="text-xl" />
                <span>Publish Destination Package</span>
              </>
            )}
          </button>

        </form>
      </div>

    </div>
  );
};

export default AddDestinationPage;
