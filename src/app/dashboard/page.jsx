"use client";

import { authClient } from "@/lib/auth-client";
import { BookingCancelAlert } from "@/components/BookingCancelAlert";
import { AddDestinationModal } from "@/components/AddDestinationModal";
import { EditModal } from "@/components/EditModal";
import { DeleteAlert } from "@/components/DeleteAlert";
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
  HiOutlineArrowRightOnRectangle,
  HiOutlineUsers,
  HiOutlineMap,
  HiOutlineUserGroup,
  HiOutlineCheckBadge,
  HiOutlineFolder
} from "react-icons/hi2";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Live Role state (fetches directly from database)
  const [userRole, setUserRole] = useState(user?.role || "user");
  const isAdmin = userRole === "admin" || user?.role === "admin";

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "bookings" | "my-destinations" | "users" | "all-bookings"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Private Route Auth Check
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  // Fetch Dashboard Data
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: tokenData } = await authClient.token();
      const headers = tokenData?.token ? { authorization: `Bearer ${tokenData.token}` } : {};

      // 1. Fetch User Personal Bookings
      if (user.id) {
        const resUserBookings = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/booking/${user.id}`,
          { headers }
        );
        if (resUserBookings.ok) {
          const data = await resUserBookings.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      }

      // 2. Fetch All Destinations (To filter Owner Destinations)
      const resDest = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination`);
      if (resDest.ok) {
        const dData = await resDest.json();
        setAllDestinations(Array.isArray(dData) ? dData : []);
      }

      // 3. Fetch Admin Data (If Admin)
      const resUsers = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/users`);
      if (resUsers.ok) {
        const uData = await resUsers.json();
        setAllUsers(Array.isArray(uData) ? uData : []);

        const matched = uData.find((u) => u.email === user.email);
        if (matched && matched.role) {
          setUserRole(matched.role);
        }
      }

      const resAllBookings = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/all-bookings`);
      if (resAllBookings.ok) {
        const bData = await resAllBookings.json();
        setAllBookings(Array.isArray(bData) ? bData : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle Sign Out
  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  // Toggle User Role (Admin Action)
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/users/${targetUser._id || targetUser.id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (res.ok) {
        toast.success(`User role updated to ${newRole.toUpperCase()}`);
        fetchData();
      } else {
        toast.error("Failed to update user role");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
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

  // Filter Owner Destinations (Destinations added by logged in user, or all catalog packages for admin)
  const myAddedDestinations = allDestinations.filter((d) => {
    if (d.userId || d.userEmail) {
      return d.userId === user.id || d.userEmail === user.email || isAdmin;
    }
    return true;
  });

  // Personal Metrics
  const totalSpent = bookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0);
  const upcomingBookings = bookings
    .filter(b => b.departureDate)
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
  
  const nextDeparture = upcomingBookings.length > 0 
    ? new Date(upcomingBookings[0].departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
    : "No Upcoming Trip";

  // Admin Metrics
  const grossRevenue = allBookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {isAdmin ? <HiOutlineShieldCheck className="text-rose-400" /> : <HiOutlineSquares2X2 />}
            <span>{isAdmin ? "Admin Executive Portal" : "Traveler Control Portal"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-gradient-cyan">{user.name || "Explorer"}</span>! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isAdmin 
              ? "Administrator Control Dashboard: Manage platform users, global reservations, and catalog packages." 
              : "Manage your bookings, edit/delete your published packages, and view travel metrics."}
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
              <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full border ${
                isAdmin 
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30 font-extrabold" 
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}>
                {isAdmin ? <HiOutlineShieldCheck /> : <HiOutlineCheckBadge />}
                <span>{userRole.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Sidebar Menu Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 block mb-1">
              {isAdmin ? "Admin Controls" : "User Navigation"}
            </span>

            {/* Overview */}
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

            {/* Owner Tab: My Added Destinations */}
            <button
              onClick={() => setActiveTab("my-destinations")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "my-destinations"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <HiOutlineFolder className={`text-base flex-shrink-0 ${activeTab === "my-destinations" ? "text-white" : "text-cyan-400"}`} />
                <span className="truncate">My Added Packages</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 flex-shrink-0 ${
                activeTab === "my-destinations" ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-400"
              }`}>
                {myAddedDestinations.length}
              </span>
            </button>

            {/* User View: My Bookings */}
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

            {/* Admin View: Users Management */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <HiOutlineUsers className={`text-base flex-shrink-0 ${activeTab === "users" ? "text-white" : "text-cyan-400"}`} />
                  <span className="truncate">Manage Users</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 flex-shrink-0 ${
                  activeTab === "users" ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  {allUsers.length}
                </span>
              </button>
            )}

            {/* Admin View: All System Bookings */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab("all-bookings")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === "all-bookings"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <HiOutlineBookmark className={`text-base flex-shrink-0 ${activeTab === "all-bookings" ? "text-white" : "text-cyan-400"}`} />
                  <span className="truncate">All Bookings</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 flex-shrink-0 ${
                  activeTab === "all-bookings" ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  {allBookings.length}
                </span>
              </button>
            )}

            {/* Add Destination Modal Trigger */}
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
              
              {/* Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl sm:text-2xl flex-shrink-0">
                    {isAdmin ? <HiOutlineUsers /> : <HiOutlineBookmark />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {isAdmin ? "Total Users" : "Reserved Trips"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white truncate">
                      {isAdmin ? `${allUsers.length} Registered` : `${bookings.length} Packages`}
                    </h3>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineCurrencyDollar />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {isAdmin ? "Gross Revenue" : "Total Investment"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-cyan-400 truncate">
                      ${isAdmin ? grossRevenue : totalSpent}
                    </h3>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl sm:text-2xl flex-shrink-0">
                    {isAdmin ? <HiOutlineBookmark /> : <HiOutlineCalendar />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {isAdmin ? "Global Bookings" : "Next Departure"}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-emerald-400 truncate">
                      {isAdmin ? `${allBookings.length} Total` : nextDeparture}
                    </h3>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-cyan-500/40 transition-all min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl sm:text-2xl flex-shrink-0">
                    <HiOutlineFolder />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                      My Added Packages
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-amber-300 truncate">
                      {myAddedDestinations.length} Published
                    </h3>
                  </div>
                </div>

              </div>

              {/* Recent Activity Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-cyan-500" />
                    {isAdmin ? "Recent Platform Reservations" : "Recent Reservations"}
                  </h2>

                  <button
                    onClick={() => setActiveTab(isAdmin ? "all-bookings" : "bookings")}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isAdmin ? "Manage All System Bookings" : "Manage All Bookings"}</span>
                    <HiOutlineArrowRight />
                  </button>
                </div>

                {loading ? (
                  <div className="glass-panel p-8 rounded-3xl text-center text-slate-400 animate-pulse">
                    Loading dashboard data...
                  </div>
                ) : (isAdmin ? allBookings : bookings).length > 0 ? (
                  <div className="space-y-4">
                    {(isAdmin ? allBookings : bookings).slice(0, 4).map((booking) => (
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

          {/* TAB 2: MY ADDED DESTINATIONS (OWNER MANAGEMENT) */}
          {activeTab === "my-destinations" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <HiOutlineFolder className="text-cyan-400" />
                  My Published Packages ({myAddedDestinations.length})
                </h2>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="glossy-btn px-4 py-2 rounded-xl text-xs font-bold w-full sm:w-auto text-center"
                >
                  + Add New Destination
                </button>
              </div>

              {loading ? (
                <div className="glass-panel p-16 rounded-3xl text-center text-slate-400 animate-pulse">
                  Loading your packages...
                </div>
              ) : myAddedDestinations.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {myAddedDestinations.map((dest) => (
                    <div
                      key={dest._id}
                      className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto min-w-0">
                        <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <Image
                            src={dest.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
                            alt={dest.destinationName || "Destination"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="space-y-2 text-left min-w-0 flex-1">
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {dest.category || "Luxury"}
                          </span>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                            {dest.destinationName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                            <span className="text-cyan-400 font-semibold">{dest.country}</span>
                            <span className="text-slate-500">|</span>
                            <span>{dest.duration}</span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400 truncate">
                              ID: <code className="text-xs bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono">{dest._id}</code>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Owner Action Buttons: EDIT & DELETE */}
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-3">
                        <div className="text-left md:text-right mr-2">
                          <span className="text-xs text-slate-400 font-medium block">Price</span>
                          <span className="text-2xl font-black text-cyan-400">${dest.price}</span>
                        </div>

                        <EditModal destination={dest} onSuccess={fetchData} />
                        <DeleteAlert destination={dest} onSuccess={fetchData} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 space-y-4 max-w-lg mx-auto">
                  <HiOutlineFolder className="text-4xl text-cyan-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">No published packages yet</h3>
                  <p className="text-slate-400 text-sm">
                    You haven't added any travel destinations yet. Click below to add your first package.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="glossy-btn inline-block px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-cyan-500/25"
                  >
                    Add First Destination Package
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY BOOKINGS (USER VIEW) */}
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

              {loading ? (
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

          {/* TAB 4: MANAGE USERS (ADMIN VIEW) */}
          {isAdmin && activeTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <HiOutlineUserGroup className="text-cyan-400" />
                  System Application Users ({allUsers.length})
                </h2>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                {allUsers.length > 0 ? (
                  <div className="space-y-3">
                    {allUsers.map((u) => (
                      <div
                        key={u._id || u.id}
                        className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border border-cyan-500/50 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{u.name || "User"}</h4>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            u.role === "admin" 
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                              : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          }`}>
                            {u.role || "user"}
                          </span>

                          <button
                            onClick={() => handleToggleRole(u)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium text-slate-200 hover:text-white hover:border-cyan-500/40 transition-all"
                          >
                            Toggle Role ({u.role === "admin" ? "Make User" : "Make Admin"})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No application users found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ALL SYSTEM BOOKINGS (ADMIN VIEW) */}
          {isAdmin && activeTab === "all-bookings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <HiOutlineBookmark className="text-cyan-400" />
                  All Global Reservations ({allBookings.length})
                </h2>
              </div>

              {allBookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {allBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="glass-card p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-20 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <Image
                            src={booking.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"}
                            alt={booking.destinationName || "Booking"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-white line-clamp-1">{booking.destinationName}</h4>
                          <p className="text-xs text-slate-400 truncate">Booked By User ID: <code className="text-cyan-300">{booking.userId}</code></p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                        <span className="text-lg font-extrabold text-cyan-400">${booking.price}</span>
                        <BookingCancelAlert bookingId={booking._id} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-10 rounded-3xl text-center border border-white/10 text-slate-400 text-sm">
                  No reservations found in the system.
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
          fetchData();
        }}
      />

    </div>
  );
};

export default DashboardPage;
