'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Get current user (they become the organizer)
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to create an event.' }
  }

  const { data: profile } = await supabase.from('profiles').select('is_organizer').eq('id', user.id).single();
  if (!profile?.is_organizer) {
    return { error: 'You are not authorized to host meets.' }
  }

  const name = formData.get('name') as string
  const locationName = formData.get('location_name') as string
  const latitudeStr = formData.get('latitude') as string
  const longitudeStr = formData.get('longitude') as string
  const radiusStr = formData.get('radius_meters') as string

  if (!name || !locationName || !latitudeStr || !longitudeStr) {
    return { error: 'Please fill in all required fields.' }
  }

  const latitude = parseFloat(latitudeStr)
  const longitude = parseFloat(longitudeStr)
  const radius_meters = radiusStr ? parseInt(radiusStr) : 500

  if (isNaN(latitude) || isNaN(longitude) || isNaN(radius_meters)) {
    return { error: 'Coordinates and radius must be valid numbers.' }
  }

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      organizer_id: user.id,
      name,
      location_name: locationName,
      latitude,
      longitude,
      radius_meters
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Redirect the organizer immediately to their QR code dashboard
  redirect(`/dashboard/events/${event.id}/organizer`)
}
