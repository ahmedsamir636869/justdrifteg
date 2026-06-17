'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Scanner({ cars }: { cars: any[] }) {
  const [scannedEventId, setScannedEventId] = useState<string | null>(null)
  const [selectedCarId, setSelectedCarId] = useState<string>(cars[0]?.id || '')
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [status, setStatus] = useState<{loading: boolean, error?: string, success?: string}>({ loading: false })
  const supabase = createClient()

  useEffect(() => {
    if (scannedEventId) return;

    let scanner: Html5QrcodeScanner | null = null;
    
    // Delay initialization to bypass React 18 StrictMode double-mounting
    const timer = setTimeout(() => {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 10 }, false)
        
        scanner.render((decodedText) => {
          try {
            const payload = JSON.parse(decodedText)
            if (payload.event_id) {
              setScannedEventId(payload.event_id)
              if (scanner) {
                scanner.clear().catch(() => {})
              }
            }
          } catch (e) {
            console.error("Invalid QR code")
          }
        }, (error) => {
          // ignore empty scans
        })
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(() => {})
      }
    }
  }, [scannedEventId])

  const handleCheckIn = () => {
    if (!scannedEventId || !selectedCarId) return
    setStatus({ loading: true })

    if (!navigator.geolocation) {
      setStatus({ loading: false, error: 'Geolocation is not supported by your browser' })
      return
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      setLocation({ lat, lng })

      try {
        const { data, error } = await supabase.rpc('check_in_car', {
          p_car_id: selectedCarId,
          p_event_id: scannedEventId,
          p_lat: lat,
          p_lng: lng
        })

        if (error) {
          setStatus({ loading: false, error: error.message })
        } else {
          setStatus({ loading: false, success: `Successfully checked in! Total meets: ${data.total_meets}` })
        }
      } catch (err: any) {
        setStatus({ loading: false, error: err.message || 'Unknown error occurred' })
      }
    }, (err) => {
      setStatus({ loading: false, error: 'Failed to retrieve location: ' + err.message })
    }, { enableHighAccuracy: true })
  }

  if (cars.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Empty Garage</h3>
        <p className="text-zinc-500 mb-6 text-sm">You must add a vehicle to your garage before you can check into events.</p>
        <Link href="/dashboard" className="btn-primary">Go to Garage</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {!scannedEventId ? (
        <div className="card overflow-hidden p-4 ring-1 ring-zinc-800">
          <style dangerouslySetInnerHTML={{__html: `
            #reader { border: none !important; background: transparent !important; width: 100% !important; }
            #reader button { background: #ffffff !important; color: black !important; border-radius: 0.5rem !important; padding: 0.5rem 1rem !important; font-weight: 600 !important; border: none !important; margin: 0.25rem !important; cursor: pointer; transition: opacity 0.2s; }
            #reader button:hover { opacity: 0.8 !important; }
            #reader select { background: #18181b !important; color: white !important; border: 1px solid #27272a !important; border-radius: 0.5rem !important; padding: 0.5rem !important; outline: none !important; margin-bottom: 1rem !important; width: 100%; max-width: 300px; }
            #reader a { color: #ffffff !important; text-decoration: none !important; margin-top: 1rem; display: inline-block; font-size: 0.875rem; }
            #reader span { color: #a1a1aa !important; }
            #reader video { border-radius: 0.5rem !important; margin-top: 1rem !important; }
            #reader__dashboard_section_csr span { color: #ef4444 !important; font-size: 0.875rem; display: block; margin-bottom: 0.5rem; }
          `}} />
          <div id="reader" className="w-full"></div>
        </div>
      ) : (
        <div className="card p-8 flex flex-col gap-6 animate-in">
          <div className="flex flex-col gap-2 text-center items-center">
            <div className="w-16 h-16 bg-zinc-100/10 text-zinc-100 rounded-2xl flex items-center justify-center mb-2 glow-cyan-sm border border-zinc-100/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Event Found!</h2>
            <p className="text-zinc-400 text-sm">Select the vehicle you brought today.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="label">Select Vehicle</label>
            <div className="relative">
              <select 
                className="input-field !py-4 appearance-none pr-10 cursor-pointer"
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
              >
                {cars.map(car => (
                  <option key={car.id} value={car.id} className="bg-zinc-900 text-white py-2">{car.year} {car.make} {car.model}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckIn}
            disabled={status.loading || !!status.success}
            className="btn-primary !py-4 !rounded-xl mt-2 w-full glow-cyan-sm"
          >
            {status.loading ? 'Verifying GPS Location...' : status.success ? 'Checked In successfully' : 'Confirm Check-in'}
          </button>

          {status.error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">{status.error}</div>}
          {status.success && <div className="p-4 bg-zinc-100/10 border border-zinc-100/20 text-zinc-200 rounded-xl text-sm font-medium text-center">{status.success}</div>}
          
          {status.success && (
            <div className="flex justify-center mt-2">
              <Link href="/dashboard" className="btn-secondary !text-sm">
                Return to Garage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
