'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCar(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const car_id = formData.get('car_id') as string
  const make = formData.get('make') as string
  const model = formData.get('model') as string
  const yearStr = formData.get('year') as string
  const trim = formData.get('trim') as string
  const chassis_code = formData.get('chassis_code') as string

  if (!car_id || !make || !model || !yearStr) {
    return { error: 'Make, model, and year are required.' }
  }

  const year = parseInt(yearStr)

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: car } = await supabase.from('cars').select('owner_id').eq('id', car_id).single()
  if (!car || car.owner_id !== user.id) {
    return { error: 'Unauthorized to edit this car.' }
  }

  const { error } = await supabase
    .from('cars')
    .update({ make, model, year, trim, chassis_code })
    .eq('id', car_id)

  if (error) return { error: error.message }

  revalidatePath(`/cars/${car_id}`)
  return { success: true }
}

export async function deleteCar(car_id: string) {
  const supabase = await createClient()

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: car } = await supabase.from('cars').select('owner_id').eq('id', car_id).single()
  if (!car || car.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Manually delete related records to simulate ON DELETE CASCADE
  await supabase.from('car_images').delete().eq('car_id', car_id)
  await supabase.from('maintenance_logs').delete().eq('car_id', car_id)
  await supabase.from('unlocked_pages').delete().eq('car_id', car_id)
  await supabase.from('event_attendance').delete().eq('car_id', car_id)

  const { error } = await supabase.from('cars').delete().eq('id', car_id)
  if (error) throw new Error(error.message)

  redirect('/dashboard')
}
