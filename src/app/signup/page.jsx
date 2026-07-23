"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser, HiOutlinePhotograph, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight, HiSparkles } from "react-icons/hi";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const user = Object.fromEntries(formData.entries());

      const { data, error } = await authClient.signUp.email({
        email: user.email,
        password: user.password,
        name: user.name,
        image: user.image,
      });

      if (data) {
        toast.success("🎉 Account created successfully! Welcome aboard.");
        router.push("/");
      }
      if (error) {
        toast.error(error.message || "Failed to create account.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during signup.");
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
      toast.error("Google sign up failed.");
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      
      {/* Background Radial Glow Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-600/15 blur-[110px] rounded-full pointer-events-none" />

      {/* Main Signup Glass Container */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-7 backdrop-blur-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <HiSparkles /> Start Exploring
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Create Your <span className="text-gradient-cyan">Account</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join Wanderlust to unlock exclusive deals and personalized itineraries.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HiOutlineUser className="text-cyan-400 text-base" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              required
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Profile Image URL Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HiOutlinePhotograph className="text-cyan-400 text-base" />
              Avatar / Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Email Field */}
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
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HiOutlineLockClosed className="text-cyan-400 text-base" />
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block pt-0.5">
              Must be at least 8 characters long
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glossy-btn py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <HiOutlineArrowRight className="text-lg" />
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-950 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
            Or Sign Up With
          </span>
        </div>

        {/* Social Google Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full py-3.5 px-4 rounded-2xl glass-panel border border-white/15 text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <FcGoogle className="text-xl" />
          <span>Sign Up with Google</span>
        </button>

        {/* Login Redirect Link */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>

    </div>
  );
};

export default SignUpPage;
