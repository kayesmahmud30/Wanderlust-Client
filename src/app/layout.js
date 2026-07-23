import { Josefin_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Wanderlust | Discover Exceptional Travel Experiences",
  description: "Explore curated luxury destinations, seamless booking, and unforgettable journeys across the globe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.className} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            },
          }}
        />
      </body>
    </html>
  );
}
