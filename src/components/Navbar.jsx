"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { 
  HiBars3, 
  HiXMark, 
  HiOutlineGlobeAlt, 
  HiOutlineMap, 
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowLeftOnRectangle
} from "react-icons/hi2";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer automatically when route changes or window resizes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: HiOutlineGlobeAlt },
    { name: "Destinations", href: "/destinations", icon: HiOutlineMap },
    ...(user ? [{ name: "Dashboard", href: "/dashboard", icon: HiOutlineSquares2X2 }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-cyan-400">W</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-none">
                Wanderlust
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-cyan-400 font-semibold mt-0.5">
                Travel & Co.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Large Screens 1024px+) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`text-base ${isActive ? "text-white" : "text-cyan-400"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User / Auth Controls (Large Screens 1024px+) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 pl-2.5 pr-1.5 py-1.5 rounded-full hover:border-cyan-500/40 transition-all">
                {/* Clicking User Name / Avatar Navigates to /profile */}
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 group/profile cursor-pointer"
                  title="View Profile Settings"
                >
                  <div className="relative flex-shrink-0">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover border border-cyan-500/50 group-hover/profile:border-cyan-400 transition-colors"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs xl:text-sm group-hover/profile:bg-cyan-500 transition-colors">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                  </div>
                  <span className="text-xs xl:text-sm font-medium text-slate-200 group-hover/profile:text-cyan-300 max-w-[100px] xl:max-w-[140px] truncate transition-colors">
                    {user.name || "Profile"}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  title="Logout"
                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                >
                  <HiOutlineArrowRightOnRectangle className="text-base xl:text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs xl:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="glossy-btn px-4 py-2 rounded-full text-xs xl:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <HiOutlineUser className="text-sm" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2.5 flex-shrink-0">
            {user && (
              <Link href="/profile" className="flex items-center gap-2" title="View Profile">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <HiXMark className="w-6 h-6 text-cyan-400" />
              ) : (
                <HiBars3 className="w-6 h-6 text-cyan-400" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <>
          {/* Dark Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 top-20 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-50 lg:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
            {/* Links List */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth / Profile Area in Drawer */}
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 rounded-xl border border-white/5">
                    <Link 
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User Avatar"}
                          className="w-9 h-9 rounded-full object-cover border border-cyan-500/50 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate hover:text-cyan-400">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">Edit Profile Settings ➔</p>
                      </div>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      title="Logout"
                      className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors ml-2"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold text-xs text-center hover:bg-slate-800 transition-colors"
                  >
                    <HiOutlineArrowLeftOnRectangle className="text-base text-cyan-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="glossy-btn flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-xs text-center shadow-md shadow-cyan-500/20"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
