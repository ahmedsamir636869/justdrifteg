'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function toggleUserRole(userId: string, currentOrganizerStatus: boolean): Promise<{ error?: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing.' }
  }

  const supabase = await createClient()
  
  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { error: 'Unauthorized. Admin access required.' }
  }

  // Use service role client to bypass RLS for administrative update
  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await adminSupabase
    .from('profiles')
    .update({ is_organizer: !currentOrganizerStatus })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return {}
}
