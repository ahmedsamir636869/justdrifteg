'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function UserNavDropdown({ 
  userProfile, 
  logoutAction 
}: { 
  userProfile: { username: string, avatar_url: string | null }, 
  logoutAction: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative pointer-events-auto" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
          {userProfile.avatar_url ? (
            <Image src={userProfile.avatar_url} alt={userProfile.username} fill sizes="32px" className="object-cover" />
          ) : (
            <span className="text-xs font-bold text-zinc-400">{userProfile.username?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <span className="text-sm font-bold text-white max-w-[100px] truncate hidden lg:block">
          {userProfile.username}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-heavy border border-white/10 shadow-2xl py-2 flex flex-col animate-in slide-in-from-top-2 origin-top-right z-50">
          <div className="px-4 py-3 border-b border-white/5 mb-1">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-0.5">Signed in as</p>
            <p className="text-sm font-bold text-white truncate">{userProfile.username}</p>
          </div>
          
          <Link 
            href="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-zinc-200" /> My Garage
          </Link>
          
          <Link 
            href="/dashboard/settings" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings className="w-4 h-4 text-zinc-400" /> Profile Settings
          </Link>
          
          <div className="h-px bg-white/5 my-1 mx-2"></div>
          
          <form action={logoutAction} className="w-full">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
