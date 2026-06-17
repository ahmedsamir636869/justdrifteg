'use client'

import { useState, useActionState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateCar, deleteCar } from '@/app/actions/carSettings'
import { Settings, Trash2, X, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function CarSettingsModal({ car }: { car: any }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [state, formAction, isPending] = useActionState(updateCar, null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (state?.success) {
      toast.success('Vehicle updated successfully!')
      setOpen(false)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const handleDelete = async () => {
    if (!confirm('Are you absolutely sure you want to delete this car? This action cannot be undone and will delete all photos, maintenance logs, and event history.')) return
    setIsDeleting(true)
    try {
      await deleteCar(car.id)
      toast.success('Vehicle deleted')
    } catch (e) {
      toast.error('Failed to delete car')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider border border-zinc-700"
      >
        <Settings className="w-3.5 h-3.5" /> Edit Vehicle
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in">
          <div className="w-full max-w-md bg-[#111113] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800/50">
              <h2 className="text-xl font-bold text-white">Vehicle Settings</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh]">
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="car_id" value={car.id} />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Make</label>
                    <input required name="make" defaultValue={car.make} className="input-field bg-zinc-950" />
                  </div>
                  <div>
                    <label className="label">Model</label>
                    <input required name="model" defaultValue={car.model} className="input-field bg-zinc-950" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Year</label>
                    <input required type="number" name="year" defaultValue={car.year} className="input-field bg-zinc-950" />
                  </div>
                  <div>
                    <label className="label">Chassis Code</label>
                    <input name="chassis_code" defaultValue={car.chassis_code || ''} className="input-field bg-zinc-950" />
                  </div>
                </div>

                <div>
                  <label className="label">Trim</label>
                  <input name="trim" defaultValue={car.trim || ''} className="input-field bg-zinc-950" />
                </div>

                <button disabled={isPending} className="btn-primary w-full !py-3 !rounded-xl mt-2">
                  {isPending ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-red-500/20">
                <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-xs text-zinc-500 mb-4">Permanently delete this vehicle and all associated data.</p>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl transition-colors font-bold text-sm"
                >
                  <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
