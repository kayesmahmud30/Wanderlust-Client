"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  HiOutlinePlusCircle, 
  HiOutlineMapPin, 
  HiOutlineGlobeAlt, 
  HiOutlineTag, 
  HiOutlineCurrencyDollar, 
  HiOutlineCalendar, 
  HiOutlinePhoto, 
  HiOutlineDocumentText,
  HiXMark,
  HiOutlineSparkles
} from "react-icons/hi2";

const categories = ["Beach", "Mountain", "City", "Adventure", "Cultural", "Luxury"];

export function AddDestinationModal({ isOpen, onClose, onSuccess }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Beach");

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const destination = Object.fromEntries(formData.entries());
      destination.category = category;
      destination.price = Number(destination.price);
      destination.userId = user?.id;
      destination.userEmail = user?.email;

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
        toast.success("✨ Destination package published successfully!");
        if (onSuccess) onSuccess();
        onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HiOutlineSparkles className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Add New Destination</h2>
              <p className="text-xs text-slate-400">Publish a luxury package to the catalog</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Destination Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineMapPin className="text-cyan-400 text-sm" />
                Destination Name
              </label>
              <input
                type="text"
                name="destinationName"
                placeholder="e.g. Bali Tropical Sanctuary"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineGlobeAlt className="text-cyan-400 text-sm" />
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="e.g. Indonesia"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineTag className="text-cyan-400 text-sm" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (USD) */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineCurrencyDollar className="text-cyan-400 text-sm" />
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 1499"
                required
                min="1"
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineCalendar className="text-cyan-400 text-sm" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 7 Days / 6 Nights"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Departure Date */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineCalendar className="text-cyan-400 text-sm" />
                Scheduled Departure Date
              </label>
              <input
                type="date"
                name="departureDate"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlinePhoto className="text-cyan-400 text-sm" />
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineDocumentText className="text-cyan-400 text-sm" />
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Describe the travel experience highlights..."
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glossy-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <HiOutlinePlusCircle className="text-base" />
                  <span>Publish Package</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
