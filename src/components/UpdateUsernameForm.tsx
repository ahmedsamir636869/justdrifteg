'use client'

import { useActionState, useEffect } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export default function UpdateUsernameForm({ initialUsername }: { initialUsername: string }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Username updated successfully')
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="username" className="label">Username</label>
        <input required name="username" id="username" defaultValue={initialUsername} className="input-field" />
      </div>

      <button disabled={isPending} className="btn-primary w-full !py-3 !rounded-xl mt-4">
        {isPending ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </form>
  )
}
