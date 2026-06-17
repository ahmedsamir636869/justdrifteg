'use client'

import { useState } from 'react'
import { toggleUserRole } from '@/app/actions/admin'
import { toast } from 'sonner'

export default function AdminRoleToggle({ userId, isOrganizer }: { userId: string, isOrganizer: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const result = await toggleUserRole(userId, isOrganizer)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('User role updated')
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOrganizer ? 'bg-zinc-100' : 'bg-zinc-700'}`}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOrganizer ? 'translate-x-6' : 'translate-x-1'}`} 
      />
    </button>
  )
}
