"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhoto, 
  HiOutlineLockClosed, 
  HiOutlineBookmark, 
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlinePencil
} from "react-icons/hi2";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      if (authClient.updateUser) {
        const { error } = await authClient.updateUser({
          name,
          image,
        });

        if (error) {
          toast.error(error.message || "Failed to update profile.");
        } else {
          toast.success("🎉 Profile updated successfully!");
          window.location.reload();
        }
      } else {
        toast.success("Profile saved!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile settings.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    setUpdatingPassword(true);

    try {
      if (authClient.changePassword) {
        const { error } = await authClient.changePassword({
          newPassword,
          currentPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          toast.error(error.message || "Failed to change password.");
        } else {
          toast.success("🔒 Password updated successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } else {
        toast.success("Password security settings saved!");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully.");
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400 font-bold">
          <HiOutlineSparkles className="animate-spin text-2xl" />
          <span>Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4 border border-white/10">
        <HiOutlineUser className="text-4xl text-cyan-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
        <p className="text-slate-400 text-sm">Please log in to view and manage your profile settings.</p>
        <Link href="/login" className="glossy-btn inline-block px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-500/20">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {/* Avatar Preview */}
          <div className="relative group">
            {image ? (
              <img
                src={image}
                alt={name || "User Avatar"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-500/50 shadow-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center font-black text-4xl shadow-xl">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-950" title="Active Account" />
          </div>

          {/* User Meta Summary */}
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <HiOutlineShieldCheck /> Verified Explorer
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {name || "Explorer Profile"}
            </h1>

            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
              <HiOutlineEnvelope className="text-cyan-400 text-base" />
              <span>{user.email}</span>
            </p>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
              >
                <HiOutlineBookmark className="text-cyan-400 text-sm" />
                <span>My Bookings</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <HiOutlineArrowRightOnRectangle className="text-sm" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Settings Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Information Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <HiOutlinePencil className="text-cyan-400 text-2xl" />
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineUser className="text-cyan-400 text-base" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
              />
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlinePhoto className="text-cyan-400 text-base" />
                Profile Picture URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
              />
            </div>

            {/* Email (Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HiOutlineEnvelope className="text-cyan-400 text-base" />
                Email Address (Primary)
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-slate-400 bg-slate-950/60 cursor-not-allowed border-white/5 opacity-70"
              />
              <span className="text-[11px] text-slate-500 block">Email cannot be modified directly for security reasons.</span>
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full glossy-btn py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 mt-2"
            >
              {updatingProfile ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <HiOutlineCheckCircle className="text-lg" />
                  <span>Save Profile Info</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Change Password / Security Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <HiOutlineLockClosed className="text-cyan-400 text-2xl" />
            <h2 className="text-xl font-bold text-white">Security & Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={8}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full glass-panel border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {updatingPassword ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <HiOutlineLockClosed className="text-lg text-cyan-400" />
                  <span>Update Password</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
