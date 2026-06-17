import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "./auth/actions";
import { Compass, LayoutDashboard, QrCode, LogOut, CalendarPlus, Shield, Sparkles, Globe, Mail } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import UserNavDropdown from "@/components/UserNavDropdown";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "JUST DRIFT | Global Car Meets",
  description: "Log your builds, scan QR codes at real-world meets, and unlock premium profile badges for your vehicle.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isOrganizer = false;
  let isAdmin = false;
  let userProfile = { username: "User", avatar_url: null };
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_organizer, is_admin, username, avatar_url').eq('id', user.id).single();
    if (profile?.is_organizer) isOrganizer = true;
    if (profile?.is_admin) isAdmin = true;
    if (profile) userProfile = { username: profile.username, avatar_url: profile.avatar_url };
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans bg-[#030305] text-zinc-50 antialiased min-h-dvh flex flex-col selection:bg-zinc-100/30`}>
        
        <Toaster theme="dark" position="bottom-right" toastOptions={{ className: 'border border-zinc-800 bg-[#111113]' }} />

        {/* Floating Pill Nav */}
        <div className="w-full flex justify-center fixed top-4 sm:top-6 z-50 px-4 pointer-events-none">
          <nav className="w-full max-w-5xl glass-heavy rounded-full border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto transition-all duration-300">
            <div className="flex justify-between items-center px-4 sm:px-6 h-14 sm:h-16">
              
              <Link href="/" className="font-heading font-black text-lg sm:text-xl tracking-wide text-white flex items-center gap-2 shrink-0 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-800 flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg group-hover:scale-105 transition-transform">JD</div>
                <div className="flex flex-col leading-none">
                  <span className="text-white tracking-widest text-sm sm:text-base">JUST</span>
                  <span className="text-zinc-200 text-[10px] sm:text-xs tracking-[0.2em]">DRIFT</span>
                </div>
              </Link>

              {/* Desktop links */}
              <div className="hidden md:flex gap-1 items-center bg-white/5 p-1 rounded-full border border-white/5">
                <Link href="/explore" className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all text-sm font-medium">
                  <Compass className="w-4 h-4 text-zinc-400" /> Explore
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all text-sm font-medium">
                      <LayoutDashboard className="w-4 h-4 text-zinc-200" /> Garage
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 text-zinc-300 hover:text-zinc-400 hover:bg-zinc-500/10 px-4 py-2 rounded-full transition-all text-sm font-bold">
                        <Shield className="w-4 h-4 text-zinc-500" /> Admin
                      </Link>
                    )}
                    {isOrganizer && (
                      <Link href="/dashboard/events/create" className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all text-sm font-medium">
                        <CalendarPlus className="w-4 h-4 text-zinc-400" /> Host Meet
                      </Link>
                    )}
                    <Link href="/scan" className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-100/10 px-4 py-2 rounded-full transition-all text-sm font-bold text-zinc-200">
                      <QrCode className="w-4 h-4" /> Scan
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all text-sm font-medium">
                    Log in
                  </Link>
                )}
              </div>

              {/* Right side Auth / User actions */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <UserNavDropdown userProfile={userProfile} logoutAction={logout} />
                ) : (
                  <Link href="/signup" className="btn-primary !px-5 !py-2 !rounded-full !text-xs !shadow-none">
                    Get Started
                  </Link>
                )}
              </div>

              {/* Mobile hamburger */}
              <div className="md:hidden">
                <MobileMenu isLoggedIn={!!user} isOrganizer={isOrganizer} isAdmin={isAdmin} />
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center pt-28 pb-16 relative z-10 w-full mesh-bg">
          {children}
        </main>

        {/* Cinematic Footer */}
        <footer className="w-full bg-[#030305] border-t border-white/5 relative z-20 overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-zinc-500/5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
            
            <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-left gap-4">
              <Link href="/" className="font-heading font-black text-2xl tracking-wide text-white flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-800 flex items-center justify-center text-white text-[10px] font-black shadow-lg">JD</div>
                <div className="flex flex-col leading-none">
                  <span className="text-white tracking-widest text-lg">JUST</span>
                  <span className="text-zinc-200 text-xs tracking-[0.2em]">DRIFT</span>
                </div>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The ultimate platform for car enthusiasts to log builds, discover meets, and build a digital legacy.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-10 md:gap-20">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest">Platform</h4>
                <Link href="/explore" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Explore Cars</Link>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">My Garage</Link>
                <Link href="/scan" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Event Scanner</Link>
              </div>
              <div className="flex flex-col gap-4 text-center md:text-left">
                <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest">Connect</h4>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-400 transition-colors flex items-center justify-center md:justify-start gap-2"><Globe className="w-4 h-4" /> Community</a>
                <a href="#" className="text-sm text-zinc-400 hover:text-zinc-400 transition-colors flex items-center justify-center md:justify-start gap-2"><Mail className="w-4 h-4" /> Contact Us</a>
              </div>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600 flex items-center gap-1">
              &copy; {new Date().getFullYear()} JUST DRIFT. Built with <Sparkles className="w-3 h-3 text-zinc-100" />
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
