'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCar(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const make = formData.get('make') as string
  const model = formData.get('model') as string
  const year = parseInt(formData.get('year') as string, 10)
  const chassis = formData.get('chassis') as string
  const trim = formData.get('trim') as string

  if (!make || !model || !year) {
    return { error: 'Make, model, and year are required.' }
  }

  const { error } = await supabase.from('cars').insert({
    owner_id: user.id,
    make,
    model,
    year,
    chassis_code: chassis || null,
    trim: trim || null,
  })

  if (error) {
    console.error('Error adding car:', error)
    return { error: 'Failed to add car. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
