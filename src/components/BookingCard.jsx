"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineCheckCircle, HiSparkles, HiLockClosed } from "react-icons/hi";

const BookingCard = ({ destination }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  const { price, _id, destinationName, imageUrl, country } = destination || {};
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericPrice = Number(price) || 0;
  const totalPrice = numericPrice * Number(guests);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book this destination");
      return;
    }

    if (!departureDate) {
      toast.error("Please select a departure date");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        userId: user?.id,
        userImage: user?.image,
        userName: user?.name,
        userEmail: user?.email,
        destinationId: _id,
        destinationName,
        price: totalPrice,
        imageUrl,
        country,
        departureDate: new Date(departureDate),
        guests: Number(guests),
      };

      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        toast.success("🎉 Destination booked successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || "Failed to submit booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong with your booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 sticky top-28 backdrop-blur-2xl">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">Total Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-extrabold text-white text-gradient-cyan">${totalPrice || price}</span>
            <span className="text-xs text-slate-400">/ trip</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Available Now
        </span>
      </div>

      {/* Booking Form Inputs */}
      <form onSubmit={handleBooking} className="space-y-4">
        
        {/* Departure Date Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <HiOutlineCalendar className="text-cyan-400 text-sm" />
            Departure Date
          </label>
          <input
            type="date"
            value={departureDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
            required
          />
        </div>

        {/* Number of Guests */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <HiOutlineUserGroup className="text-cyan-400 text-sm" />
            Travelers
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
          >
            <option value="1" className="bg-slate-900 text-white">1 Guest ($ {numericPrice})</option>
            <option value="2" className="bg-slate-900 text-white">2 Guests ($ {numericPrice * 2})</option>
            <option value="3" className="bg-slate-900 text-white">3 Guests ($ {numericPrice * 3})</option>
            <option value="4" className="bg-slate-900 text-white">4 Guests ($ {numericPrice * 4})</option>
          </select>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Base price ({guests} traveler)</span>
            <span className="text-white font-medium">${numericPrice * Number(guests)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Service & Maintenance</span>
            <span className="text-emerald-400 font-semibold">Included</span>
          </div>
          <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
            <span>Total Payable</span>
            <span className="text-cyan-400">${totalPrice}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full glossy-btn py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing Booking...</span>
          ) : (
            <>
              <HiSparkles className="text-lg" />
              <span>Confirm & Book Now</span>
            </>
          )}
        </button>
      </form>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HiLockClosed className="text-cyan-400 text-sm" />
          <span>Instant reservation confirmation</span>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineCheckCircle className="text-emerald-400 text-sm" />
          <span>Free cancellation up to 48 hours prior</span>
        </div>
      </div>

    </div>
  );
};

export default BookingCard;
