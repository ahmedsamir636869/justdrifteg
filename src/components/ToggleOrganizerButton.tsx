'use client'

import { useState } from 'react'
import { toggleOrganizerStatus } from '@/app/actions/profile'
import { ShieldCheck, ShieldAlert } from 'lucide-react'

export default function ToggleOrganizerButton({ isOrganizer }: { isOrganizer: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await toggleOrganizerStatus(isOrganizer)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            Organizer Mode
            {isOrganizer ? (
              <span className="text-[10px] uppercase font-bold tracking-wider bg-zinc-100/10 text-zinc-100 border border-zinc-100/20 px-2 py-0.5 rounded">Enabled</span>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">Disabled</span>
            )}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Allows you to host meets and generate QR codes.</p>
        </div>
        
        <button 
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOrganizer ? 'bg-zinc-100' : 'bg-zinc-700'}`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOrganizer ? 'translate-x-6' : 'translate-x-1'}`} 
          />
        </button>
      </div>
    </div>
  )
}
