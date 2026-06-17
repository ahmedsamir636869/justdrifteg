'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addMaintenanceLog } from '@/app/actions/maintenance'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function AddMaintenanceForm({ carId }: { carId: string }) {
  const [state, formAction, isPending] = useActionState(addMaintenanceLog, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Maintenance record added!')
      formRef.current?.reset()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 mt-6 pt-6 border-t border-zinc-800/50">
      <h3 className="text-sm font-bold text-white mb-2">Log New Maintenance</h3>
      <input type="hidden" name="car_id" value={carId} />
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="service_type" className="label">Service Type</label>
          <input required name="service_type" id="service_type" placeholder="e.g. Oil Change" className="input-field" />
        </div>
        <div>
          <label htmlFor="date" className="label">Date</label>
          <input required type="date" name="date" id="date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field" />
        </div>
      </div>
      
      <div>
        <label htmlFor="mileage" className="label">Mileage at Service</label>
        <input required type="number" name="mileage" id="mileage" placeholder="85000" min="0" className="input-field" />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes (Optional)</label>
        <textarea name="notes" id="notes" placeholder="Replaced with Motul 8100 5W-40 and OEM filter." className="input-field min-h-[80px] resize-y" />
      </div>

      <button disabled={isPending} className="btn-secondary w-full !py-3 !rounded-xl mt-2 text-sm font-bold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors">
        {isPending ? 'Logging...' : <><Plus className="w-4 h-4" /> Save Record</>}
      </button>
    </form>
  )
}
