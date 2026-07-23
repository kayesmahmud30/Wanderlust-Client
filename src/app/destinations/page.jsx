import DestinationCard from "@/components/DestinationCard";
import React from "react";
import DestinationsClientView from "./DestinationsClientView";

const DestinationsPage = async () => {
  let destinations = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination`, {
      cache: "no-store",
    });
    if (res.ok) {
      destinations = await res.json();
    }
  } catch (err) {
    console.error("Error fetching destinations:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          World-Wide Collection
        </span>
        <h1 className="text-4xl pt-4 sm:text-6xl font-extrabold text-white tracking-tight">
          Explore Extraordinary <span className="text-gradient-cyan">Destinations</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Browse through our hand-crafted travel packages designed for adventure, relaxation, and unforgettable luxury.
        </p>
      </div>

      {/* Interactive Client Search & Filter Grid */}
      <DestinationsClientView initialDestinations={destinations} />
    </div>
  );
};

export default DestinationsPage;
