'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addCar } from '@/app/actions/car'
import { toast } from 'sonner'

export default function AddCarForm() {
  const [state, formAction, isPending] = useActionState(addCar, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Vehicle added successfully! 🎉')
      formRef.current?.reset()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="make" className="label">Make</label>
          <input required name="make" id="make" placeholder="Nissan" className="input-field" />
        </div>
        <div>
          <label htmlFor="model" className="label">Model</label>
          <input required name="model" id="model" placeholder="Skyline" className="input-field" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="year" className="label">Year</label>
          <input required type="number" name="year" id="year" placeholder="1999" min="1900" max="2100" className="input-field" />
        </div>
        <div>
          <label htmlFor="chassis" className="label">Chassis</label>
          <input name="chassis" id="chassis" placeholder="R34" className="input-field" />
        </div>
      </div>

      <div>
        <label htmlFor="trim" className="label">Trim (Optional)</label>
        <input name="trim" id="trim" placeholder="GT-R V-Spec II" className="input-field" />
      </div>

      <button disabled={isPending} className="btn-primary w-full !py-3 !rounded-xl mt-1">
        {isPending ? 'Adding...' : 'Add to Garage'}
      </button>
    </form>
  )
}
