import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiArrowRight, HiStar } from "react-icons/hi";

const DestinationCard = ({ destination }) => {
  const { _id, imageUrl, price, destinationName, duration, country, category } = destination || {};

  return (
    <div className="group relative rounded-3xl overflow-hidden glass-card flex flex-col h-full border border-white/10 shadow-xl transition-all duration-300 hover:border-cyan-500/40">
      
      {/* Destination Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <Image
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={destinationName || "Destination"}
          src={imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
          height={400}
          width={500}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category Pill Badge */}
        {category && (
          <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 shadow-md">
            {category}
          </span>
        )}

        {/* Rating Stars Mock */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-white/10 text-xs font-semibold">
          <HiStar className="text-amber-400 text-sm" />
          <span>4.9</span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 px-3.5 py-1.5 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Starting at</span>
          <span className="text-lg font-black text-cyan-400">${price}</span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-1">
            <HiOutlineLocationMarker className="text-sm" />
            <span>{country}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {destinationName}
          </h3>

          {/* Duration */}
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-2">
            <HiOutlineCalendar className="text-cyan-400 text-sm" />
            <span>{duration || "Flexible Days"}</span>
          </div>
        </div>

        {/* Card Footer CTA */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Instant Booking</span>
          
          <Link href={`/destinations/${_id}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
              <span>View Tour</span>
              <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DestinationCard;
