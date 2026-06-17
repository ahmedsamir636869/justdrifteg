'use client'

import { useState } from 'react'
import { deleteMaintenanceLog } from '@/app/actions/maintenance'
import { Trash2 } from 'lucide-react'

export default function DeleteMaintenanceButton({ logId, carId }: { logId: string, carId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this log?')) return
    setIsDeleting(true)
    try {
      await deleteMaintenanceLog(logId, carId)
    } catch (e) {
      alert('Failed to delete log')
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
      title="Delete record"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
