"use client";

import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlinePaperAirplane,
  HiHeart
} from "react-icons/hi";
import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing to Wanderlust VIP!");
    e.target.reset();
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black text-cyan-400">W</span>
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Wanderlust
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your gateway to extraordinary travel experiences around the world. We architect bespoke, luxury, and unforgettable escapes tailored to your soul.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                Subscribe for Exclusive Deals
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    required
                    className="w-full glass-input pl-10 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="glossy-btn p-2.5 rounded-xl text-white shadow-md shadow-cyan-500/20 flex-shrink-0"
                  aria-label="Subscribe"
                >
                  <HiOutlinePaperAirplane className="text-base rotate-90" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-cyan-400 transition-colors">Destinations</Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-cyan-400 transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link href="/add-destination" className="hover:text-cyan-400 transition-colors">Add Destination</Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Help Center & FAQ</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Trust & Safety</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <HiOutlinePhone className="text-cyan-400 text-base flex-shrink-0" />
                <span>+1 (786) 901-1622</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HiOutlineMail className="text-cyan-400 text-base flex-shrink-0" />
                <span>concierge@wanderlust.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="text-cyan-400 text-base flex-shrink-0 mt-0.5" />
                <span>777 Grand Avenue, Suite 100, New York, NY</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1 text-slate-400">
            © {new Date().getFullYear()} Wanderlust Inc. Crafted with <HiHeart className="text-rose-500 inline" /> for luxury explorers.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: FaTwitter, href: "#" },
              { icon: FaInstagram, href: "#" },
              { icon: FaFacebookF, href: "#" },
              { icon: FaLinkedinIn, href: "#" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
                >
                  <Icon className="text-sm" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
