import { BookingCancelAlert } from "@/components/BookingCancelAlert";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { 
  HiOutlineBookmark, 
  HiOutlineCalendar, 
  HiOutlineTicket, 
  HiOutlineCurrencyDollar, 
  HiOutlineGlobe,
  HiOutlineArrowRight
} from "react-icons/hi";

const MyBookingPage = async () => {
  let session = null;
  let token = "";
  try {
    const headersList = await headers();
    session = await auth.api.getSession({ headers: headersList });
    const tokenData = await auth.api.getToken({ headers: headersList });
    token = tokenData?.token || "";
  } catch (e) {
    // Session retrieval error handling
  }

  const user = session?.user;

  let bookings = [];
  if (user?.id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/booking/${user.id}`,
        {
          headers: token ? { authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        }
      );
      if (res.ok) {
        bookings = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch user bookings:", e);
    }
  }

  const totalSpent = bookings.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-flex items-center gap-1.5 mb-2">
            <HiOutlineBookmark /> Traveler Dashboard
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            My <span className="text-gradient-cyan">Bookings</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Manage your upcoming expeditions and travel reservations.
          </p>
        </div>

        <Link
          href="/destinations"
          className="glossy-btn px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center gap-2 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>Explore More Trips</span>
          <HiOutlineArrowRight />
        </Link>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl">
            <HiOutlineTicket />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reserved</span>
            <h3 className="text-2xl font-black text-white">{bookings.length} Packages</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
            <HiOutlineGlobe />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trip Status</span>
            <h3 className="text-2xl font-black text-emerald-400">Confirmed</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl">
            <HiOutlineCurrencyDollar />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Investment</span>
            <h3 className="text-2xl font-black text-cyan-400">${totalSpent}</h3>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Your Expeditions</h2>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/40 transition-all"
              >
                {/* Left Thumbnail & Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                    <Image
                      src={booking.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
                      alt={booking.destinationName || "Booking Image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <span>Confirmed Pass</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white">
                      {booking.destinationName}
                    </h3>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <HiOutlineCalendar className="text-base" />
                        {booking.departureDate
                          ? new Date(booking.departureDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Flexible Date"}
                      </span>

                      <span className="text-slate-500">|</span>

                      <span className="text-slate-400">
                        ID: <code className="text-xs bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono">{booking._id}</code>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Price & Cancel Action */}
                <div className="flex md:flex-col items-center justify-between md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-4">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-400 font-medium block">Total Paid</span>
                    <span className="text-3xl font-black text-cyan-400">${booking.price}</span>
                  </div>

                  <BookingCancelAlert bookingId={booking._id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 rounded-3xl text-center border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto text-3xl">
              <HiOutlineBookmark />
            </div>
            <h3 className="text-xl font-bold text-white">No active bookings found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't reserved any destinations yet. Explore our hand-crafted destinations and book your next dream getaway today.
            </p>
            <Link href="/destinations" className="glossy-btn inline-block px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-cyan-500/25">
              Explore Destinations Now
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyBookingPage;
