'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string

  if (!username || username.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if username is taken by someone else
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .maybeSingle()

  if (existingUser) {
    return { error: 'Username is already taken.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: 'Profile updated successfully' }
}

export async function updateAvatarUrl(avatarUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/settings')
}

export async function toggleOrganizerStatus(currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ is_organizer: !currentStatus })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
}
