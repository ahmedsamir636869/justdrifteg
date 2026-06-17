'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!username || username.trim().length === 0) {
    redirect('/login?message=' + encodeURIComponent('Username is required for signup'))
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.trim(),
      },
    },
  })

  if (error) {
    redirect('/signup?message=' + encodeURIComponent(error.message))
  }

  // If email confirmation is OFF, user gets a session immediately
  if (signUpData.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // If email confirmation is ON, tell the user to check their inbox
  redirect('/signup?message=' + encodeURIComponent('Check your email to confirm your account before signing in.'))
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
