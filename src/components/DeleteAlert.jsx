"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineExclamationTriangle } from "react-icons/hi2";

export function DeleteAlert({ destination, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { _id, destinationName } = destination || {};

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Destination deleted permanently.");
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/destinations");
        }
      } else {
        const data = await res.json();
        toast.error(data?.message || "Failed to delete destination.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting destination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
      >
        <HiOutlineTrash className="text-base" />
        <span>Delete</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto text-3xl">
              <HiOutlineExclamationTriangle />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Delete Destination?</h3>
              <p className="text-sm text-slate-300">
                Are you sure you want to permanently delete <strong className="text-white">{destinationName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 disabled:opacity-50 transition-all"
              >
                {loading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
