import Banner from "@/components/Banner";
import DestinationCard from "@/components/DestinationCard";
import Link from "next/link";
import { 
  HiOutlineSparkles, 
  HiOutlineShieldCheck, 
  HiOutlineUserGroup, 
  HiOutlinePhone, 
  HiOutlineStar, 
  HiOutlineGlobeAlt, 
  HiOutlineArrowRight,
  HiOutlineCheckCircle
} from "react-icons/hi2";

async function getFeaturedDestinations() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/destination`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

export default async function Home() {
  const destinations = await getFeaturedDestinations();
  const featured = Array.isArray(destinations) ? destinations.slice(0, 4) : [];

  const stats = [
    { label: "Curated Destinations", value: "250+", icon: HiOutlineGlobeAlt },
    { label: "Happy Travelers", value: "18,500+", icon: HiOutlineUserGroup },
    { label: "Average Rating", value: "4.9 / 5.0", icon: HiOutlineStar },
    { label: "Support Concierge", value: "24 / 7", icon: HiOutlinePhone },
  ];

  const features = [
    {
      title: "Handpicked Luxury",
      description: "Each sanctuary and tour is personally vetted by our travel architects for uncompromised elegance.",
      icon: HiOutlineSparkles,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Price Guarantee",
      description: "Best rate commitment across all private villas, island retreats, and guided expeditions.",
      icon: HiOutlineShieldCheck,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "24/7 Personal Assistance",
      description: "Dedicated travel concierge available at every step of your journey for complete peace of mind.",
      icon: HiOutlinePhone,
      color: "from-indigo-600 to-purple-600",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <Banner />

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`flex flex-col items-center justify-center p-4 ${idx !== 0 ? "pt-6 md:pt-4" : ""}`}>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon className="text-2xl" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-white text-gradient-cyan">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section id="featured-destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <HiOutlineSparkles />
              <span>Handpicked Escapes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured <span className="text-gradient-cyan">Destinations</span>
            </h2>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm tracking-wide group"
          >
            <span>View All Destinations ({destinations.length || 0})</span>
            <HiOutlineArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center border border-white/10">
            <p className="text-slate-400 text-lg">No destinations loaded yet. Add your first destination to get started!</p>
            <Link
              href="/add-destination"
              className="mt-4 inline-block glossy-btn px-6 py-3 rounded-2xl text-sm font-bold"
            >
              Add New Destination
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose Wanderlust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden glass-panel border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Travelers Choose <span className="text-gradient-cyan">Wanderlust</span>
            </h2>
            <p className="text-slate-400 text-base mt-3 leading-relaxed">
              We eliminate friction from wanderlust, offering seamless luxury booking with unprecedented personalized attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-4 relative group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-cyan-400">
                      <Icon className="text-2xl" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 overflow-hidden shadow-2xl">
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Exclusive Access</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Unlock Secret Destinations & Deals
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Join 50,000+ jet-setters receiving weekly curated travel guides and VIP discounts directly to their inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your work or personal email..."
                  className="glass-input px-5 py-4 rounded-2xl flex-1 text-sm text-white focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="glossy-btn px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap shadow-lg shadow-cyan-500/25"
                >
                  Subscribe Now
                </button>
              </form>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 justify-center lg:justify-start">
                <HiOutlineCheckCircle className="text-emerald-400 text-base" />
                <span>No spam ever. Unsubscribe anytime in 1 click.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
