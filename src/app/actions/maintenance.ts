'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMaintenanceLog(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const car_id = formData.get('car_id') as string
  const service_type = formData.get('service_type') as string
  const mileageStr = formData.get('mileage') as string
  const dateStr = formData.get('date') as string
  const notes = formData.get('notes') as string

  if (!car_id || !service_type || !mileageStr || !dateStr) {
    return { error: 'Please fill in all required fields.' }
  }

  const mileage = parseInt(mileageStr)
  if (isNaN(mileage)) {
    return { error: 'Mileage must be a valid number.' }
  }

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: car } = await supabase.from('cars').select('owner_id').eq('id', car_id).single()
  if (!car || car.owner_id !== user.id) {
    return { error: 'Unauthorized to add logs to this car.' }
  }

  const { error } = await supabase
    .from('maintenance_logs')
    .insert({
      car_id,
      service_type,
      mileage,
      date: new Date(dateStr).toISOString(),
      notes
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/cars/${car_id}`)
  return { success: true }
}

export async function deleteMaintenanceLog(log_id: string, car_id: string) {
  const supabase = await createClient()

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: car } = await supabase.from('cars').select('owner_id').eq('id', car_id).single()
  if (!car || car.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('maintenance_logs').delete().eq('id', log_id)
  
  if (error) throw new Error(error.message)

  revalidatePath(`/cars/${car_id}`)
}
