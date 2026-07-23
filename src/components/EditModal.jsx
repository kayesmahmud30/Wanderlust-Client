"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePencilAlt, HiOutlineX } from "react-icons/hi";

export function EditModal({ destination }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    _id,
    imageUrl,
    price,
    destinationName,
    duration,
    country,
    description,
    category,
    departureDate,
  } = destination || {};

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedDestination = Object.fromEntries(formData.entries());
      updatedDestination.price = Number(updatedDestination.price);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDestination),
      });

      if (res.ok) {
        toast.success("Destination updated successfully!");
        setIsOpen(false);
        window.location.reload();
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || "Failed to update destination");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating destination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl glass-panel text-slate-200 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
      >
        <HiOutlinePencilAlt className="text-base text-cyan-400" />
        <span>Edit Package</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <HiOutlinePencilAlt className="text-cyan-400 text-2xl" />
                Edit Destination Package
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Destination Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    name="destinationName"
                    defaultValue={destinationName}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={country}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={category || "Beach"}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Beach" className="bg-slate-900 text-white">Beach</option>
                    <option value="Mountain" className="bg-slate-900 text-white">Mountain</option>
                    <option value="City" className="bg-slate-900 text-white">City</option>
                    <option value="Adventure" className="bg-slate-900 text-white">Adventure</option>
                    <option value="Cultural" className="bg-slate-900 text-white">Cultural</option>
                    <option value="Luxury" className="bg-slate-900 text-white">Luxury</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={price}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    defaultValue={duration}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Departure Date */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    defaultValue={departureDate ? new Date(departureDate).toISOString().split("T")[0] : ""}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={imageUrl}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    defaultValue={description}
                    required
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none"
                  />
                </div>

              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glossy-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
