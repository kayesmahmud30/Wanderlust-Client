import BookingCard from "@/components/BookingCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck
} from "react-icons/hi";

const DestinationDetailsPage = async ({ params }) => {
  const { id } = await params;
  
  let token = "";
  try {
    const tokenResult = await auth.api.getToken({
      headers: await headers(),
    });
    token = tokenResult?.token || "";
  } catch (e) {
    // Session token retrieval fail-safe
  }

  let destination = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination/${id}`,
      {
        headers: token ? { authorization: `Bearer ${token}` } : {},
        cache: "no-store"
      }
    );
    if (res.ok) {
      destination = await res.json();
    }
  } catch (e) {
    console.error("Failed to load destination details:", e);
  }

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">Destination Not Found</h1>
        <p className="text-slate-400">The destination package you requested could not be retrieved.</p>
        <Link href="/destinations" className="glossy-btn inline-block px-6 py-3 rounded-2xl text-sm font-bold">
          Back to Destinations
        </Link>
      </div>
    );
  }

  const {
    _id,
    imageUrl,
    destinationName,
    duration,
    country,
    category,
    description,
  } = destination;

  const highlights = [
    "Guided private excursions with native travel architects",
    "Luxury 5-star ocean view sanctuary accommodations",
    "All gourmet breakfasts and curated dining experiences included",
    "Comprehensive VIP airport transfer and 24/7 concierge assistance",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-semibold text-sm transition-colors"
        >
          <HiOutlineArrowLeft className="text-lg" />
          <span>Back to All Destinations</span>
        </Link>
      </div>

      {/* Hero Cover Image Header */}
      <div className="relative rounded-3xl overflow-hidden h-[420px] sm:h-[500px] w-full border border-white/10 shadow-2xl">
        <Image
          className="w-full h-full object-cover"
          alt={destinationName || "Destination Image"}
          src={imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}
          height={600}
          width={1200}
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-slate-950/40 to-transparent" />
        
        {/* Overlay Title & Category Badges */}
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-500/40 shadow-lg">
                {category}
              </span>
            )}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
              <HiOutlineLocationMarker className="text-cyan-400 text-base" />
              <span>{country}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
              <HiOutlineCalendar className="text-cyan-400 text-base" />
              <span>{duration || "Flexible Days"}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {destinationName}
          </h1>
        </div>
      </div>

      {/* Main Content Layout (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column - Details & Overview */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview Container */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-cyan-500" />
              Package Overview
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Key Experience Highlights */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Experience Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/50 border border-white/5">
                  <HiOutlineCheckCircle className="text-cyan-400 text-xl flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Features & Policies */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HiOutlineShieldCheck className="text-cyan-400 text-2xl" />
              Wanderlust Guarantee & Inclusions
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every travel itinerary booked with Wanderlust includes comprehensive emergency support, verified sanctuary compliance, flexible date re-scheduling up to 14 days prior to departure, and personal airport meet-and-greet services.
            </p>
          </div>

        </div>

        {/* Right Column - Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <BookingCard destination={destination} />
        </div>

      </div>

    </div>
  );
};

export default DestinationDetailsPage;
