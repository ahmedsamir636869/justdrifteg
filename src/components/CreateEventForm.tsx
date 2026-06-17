'use client'

import { useActionState, useEffect } from 'react'
import { createEvent } from '@/app/actions/event'
import { MapPin, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateEventForm() {
  const [state, formAction, isPending] = useActionState(createEvent, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const handleGetLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latInput = document.getElementById('latitude') as HTMLInputElement
        const lngInput = document.getElementById('longitude') as HTMLInputElement
        if (latInput) latInput.value = position.coords.latitude.toString()
        if (lngInput) lngInput.value = position.coords.longitude.toString()
      },
      (error) => {
        alert('Could not get your location. Please ensure location permissions are granted.')
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="label">Event Name</label>
        <input required name="name" id="name" placeholder="E.g. Midnight Tokyo Meet" className="input-field !py-3" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location_name" className="label">Location Description</label>
        <input required name="location_name" id="location_name" placeholder="E.g. Daikoku Futo Parking Area" className="input-field !py-3" />
      </div>

      <div className="card p-5 bg-zinc-900/50 border-zinc-800/50 mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">GPS Verification Area</h3>
          <button onClick={handleGetLocation} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-zinc-100" /> Use Current Location
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="latitude" className="label">Latitude</label>
            <input required type="number" step="any" name="latitude" id="latitude" placeholder="35.4616" className="input-field bg-zinc-950 border-zinc-800" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="longitude" className="label">Longitude</label>
            <input required type="number" step="any" name="longitude" id="longitude" placeholder="139.6806" className="input-field bg-zinc-950 border-zinc-800" />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-800/50">
          <label htmlFor="radius_meters" className="label">Check-in Radius (Meters)</label>
          <div className="flex items-center gap-3">
            <input required type="range" name="radius_meters" id="radius_meters" min="50" max="2000" step="50" defaultValue="500" className="w-full accent-zinc-100" onChange={(e) => document.getElementById('radius-display')!.textContent = e.target.value + 'm'} />
            <span id="radius-display" className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded w-16 text-center">500m</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Users must be within this distance to the exact coordinates to scan in.</p>
        </div>
      </div>

      <button disabled={isPending} className="btn-primary w-full !py-4 !rounded-xl mt-4 glow-cyan-sm text-base">
        {isPending ? 'Generating QR Dashboard...' : 'Create Event & Generate QR'} <ArrowRight className="w-5 h-5 ml-1" />
      </button>
    </form>
  )
}
