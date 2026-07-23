"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight, HiSparkles } from "react-icons/hi";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const user = Object.fromEntries(formData.entries());

      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      if (data) {
        toast.success("Welcome back to Wanderlust!");
        router.push("/");
      }
      if (error) {
        toast.error(error.message || "Failed to sign in. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed.");
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
      
      {/* Background Radial Glow Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Login Glass Container */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8 backdrop-blur-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <HiSparkles /> Welcome Back
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Sign In to <span className="text-gradient-cyan">Wanderlust</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Access your saved trips, bookings, and VIP travel perks.
          </p>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HiOutlineMail className="text-cyan-400 text-base" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineLockClosed className="text-cyan-400 text-base" />
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glossy-btn py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <HiOutlineArrowRight className="text-lg" />
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-950 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
            Or Continue With
          </span>
        </div>

        {/* Social Google Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full py-3.5 px-4 rounded-2xl glass-panel border border-white/15 text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <FcGoogle className="text-xl" />
          <span>Sign In with Google</span>
        </button>

        {/* Signup Redirect Link */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
