'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Compass, LayoutDashboard, QrCode, LogIn, UserPlus, CalendarPlus, Shield } from 'lucide-react'

export default function MobileMenu({ isLoggedIn, isOrganizer, isAdmin }: { isLoggedIn: boolean, isOrganizer?: boolean, isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-zinc-400 hover:text-white transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 glass border-b border-zinc-800/50 animate-in z-50">
          <div className="flex flex-col p-4 gap-1">
            <Link href="/explore" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
              <Compass className="w-5 h-5 text-zinc-100" /> Explore Builds
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                  <LayoutDashboard className="w-5 h-5 text-zinc-100" /> My Garage
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                    <Shield className="w-5 h-5 text-zinc-500" /> Admin Panel
                  </Link>
                )}
                {isOrganizer && (
                  <Link href="/dashboard/events/create" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                    <CalendarPlus className="w-5 h-5 text-zinc-100" /> Host Meet
                  </Link>
                )}
                <Link href="/scan" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                  <QrCode className="w-5 h-5 text-zinc-100" /> Scan QR
                </Link>
                <div className="border-t border-zinc-800 my-2"></div>
                <button 
                  onClick={async () => {
                    const { logout } = await import('@/app/auth/actions')
                    await logout()
                  }} 
                  className="w-full text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                  <LogIn className="w-5 h-5 text-zinc-100" /> Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 px-4 py-3 rounded-xl transition-all font-medium">
                  <UserPlus className="w-5 h-5 text-zinc-100" /> Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
