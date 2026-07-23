"use client";

import { authClient } from "@/lib/auth-client";
import { BookingCancelAlert } from "@/components/BookingCancelAlert";
import { AddDestinationModal } from "@/components/AddDestinationModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  HiOutlineSquares2X2, 
  HiOutlineBookmark, 
  HiOutlineCurrencyDollar, 
  HiOutlineSparkles, 
  HiOutlineCalendar, 
  HiOutlinePlusCircle, 
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "bookings"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Private Route Auth Check
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  // Fetch User Bookings when user is logged in
  const fetchBookings = async () => {
    if (user?.id) {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/booking/${user.id}`,
          {
            headers: tokenData?.token ? { authorization: `Bearer ${tokenData.token}` } : {},
          }
        );
        if (res.ok) {
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Handle Sign Out
  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400 font-bold">
          <HiOutlineSparkles className="animate-spin text-2xl" />
          <span>Securing Dashboard Access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4 border border-white/10">
        <HiOutlineShieldCheck className="text-4xl text-cyan-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Private Dashboard Area</h2>
        <p className="text-slate-400 text-sm">Please log in to access your personal dashboard.</p>
        <Link href="/login" className="glossy-btn inline-block px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-500/20">
          Sign In Now
        </Link>
      </div>
    );
  }

  const totalSpent = bookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0);
  const upcomingBookings = bookings
    .filter(b => b.departureDate)
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
  
  const nextDeparture = upcomingBookings.length > 0 
    ? new Date(upcomingBookings[0].departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
    : "No Upcoming Trip";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <HiOutlineSquares2X2 /> Executive Control Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-gradient-cyan">{user.name || "Explorer"}</span>! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your bookings, create new destinations, and update your settings.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glossy-btn px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 z-10 w-full sm:w-auto justify-center"
        >
          <HiOutlinePlusCircle className="text-lg flex-shrink-0" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Main Grid: Sidebar on Left (1 Col) + Main View Content on Right (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl space-y-6 sticky top-28 backdrop-blur-2xl">
          
          {/* User Profile Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/50 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                <HiOutlineShieldCheck /> VIP Explorer
              </span>
            </div>
          </div>

          {/* Sidebar Menu Group: Dashboard Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 block mb-1">
              Dashboard Navigation
            </span>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <HiOutlineSquares2X2 className={`text-base flex-shrink-0 ${activeTab === "overview" ? "text-white" : "text-cyan-400"}`} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <HiOutlineBookmark className={`text-base flex-shrink-0 ${activeTab === "bookings" ? "text-white" : "text-cyan-400"}`} />
                <span className="truncate">My Bookings</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 flex-shrink-0 ${
                activeTab === "bookings" ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-400"
              }`}>
                {bookings.length}
              </span>
            </button>

            {/* Triggers Add Destination Modal */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <HiOutlinePlusCircle className="text-base text-cyan-400 flex-shrink-0" />
              <span className="truncate">Add Destination</span>
            </button>
          </div>

          {/* Sidebar Footer Sign Out */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all"
            >
              <HiOutlineArrowRightOnRectangle className="text-base flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

        {/* MAIN DASHBOARD CONTENT AREA (3 Cols) */}
        <div className="lg:col-span-3 space-y-8 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Overview Metrics Cards Grid - Fully Responsive Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineBookmark />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">Reserved Trips</span>
                    <h3 className="text-lg sm:text-xl font-black text-white truncate">{bookings.length} Packages</h3>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineCurrencyDollar />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">Total Investment</span>
                    <h3 className="text-lg sm:text-xl font-black text-cyan-400 truncate">${totalSpent}</h3>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineCalendar />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">Next Departure</span>
                    <h3 className="text-base sm:text-lg font-bold text-emerald-400 truncate">{nextDeparture}</h3>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineSparkles />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">Traveler Status</span>
                    <h3 className="text-base sm:text-lg font-bold text-amber-300 truncate">VIP Voyager</h3>
                  </div>
                </div>

              </div>

              {/* Recent Activity Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-cyan-500" />
                    Recent Reservations
                  </h2>

                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Manage All Bookings</span>
                    <HiOutlineArrowRight />
                  </button>
                </div>

                {loadingBookings ? (
                  <div className="glass-panel p-8 rounded-3xl text-center text-slate-400 animate-pulse">
                    Loading reservation data...
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking._id}
                        className="glass-card p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                          <div className="relative w-20 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                            <Image
                              src={booking.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
                              alt={booking.destinationName || "Booking"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-bold text-white line-clamp-1">
                              {booking.destinationName}
                            </h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <HiOutlineCalendar className="text-cyan-400 flex-shrink-0" />
                              {booking.departureDate
                                ? new Date(booking.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "Flexible Date"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <span className="text-lg font-extrabold text-cyan-400">${booking.price}</span>
                          <BookingCancelAlert bookingId={booking._id} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-10 rounded-3xl text-center border border-white/10 space-y-3">
                    <HiOutlineBookmark className="text-3xl text-cyan-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">No active reservations</h3>
                    <p className="text-slate-400 text-xs">Reserve your next luxury expedition today.</p>
                    <Link href="/destinations" className="glossy-btn inline-block px-5 py-2 rounded-xl text-xs font-bold">
                      Explore Destinations
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <HiOutlineBookmark className="text-cyan-400" />
                  My Reserved Bookings ({bookings.length})
                </h2>

                <Link href="/destinations" className="glossy-btn px-4 py-2 rounded-xl text-xs font-bold w-full sm:w-auto text-center">
                  + Book New Destination
                </Link>
              </div>

              {loadingBookings ? (
                <div className="glass-panel p-16 rounded-3xl text-center text-slate-400 animate-pulse">
                  Loading your bookings...
                </div>
              ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto min-w-0">
                        <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <Image
                            src={booking.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
                            alt={booking.destinationName || "Booking"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="space-y-2 text-left min-w-0 flex-1">
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Confirmed Pass
                          </span>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                            {booking.destinationName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                            <span className="flex items-center gap-1 text-cyan-400">
                              <HiOutlineCalendar className="text-base" />
                              {booking.departureDate
                                ? new Date(booking.departureDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                                : "Flexible Date"}
                            </span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400 truncate">
                              ID: <code className="text-xs bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono">{booking._id}</code>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center justify-between md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-4">
                        <div className="text-left md:text-right">
                          <span className="text-xs text-slate-400 font-medium block">Total Paid</span>
                          <span className="text-2xl sm:text-3xl font-black text-cyan-400">${booking.price}</span>
                        </div>

                        <BookingCancelAlert bookingId={booking._id} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 space-y-4 max-w-lg mx-auto">
                  <HiOutlineBookmark className="text-4xl text-cyan-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">No bookings reserved yet</h3>
                  <p className="text-slate-400 text-sm">
                    Explore handpicked luxury destinations and reserve your next adventure.
                  </p>
                  <Link href="/destinations" className="glossy-btn inline-block px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-cyan-500/25">
                    Browse Destinations Now
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Responsive Add Destination Modal */}
      <AddDestinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchBookings();
        }}
      />

    </div>
  );
};

export default DashboardPage;
