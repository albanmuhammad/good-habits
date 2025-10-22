import { createClientFromRequest } from './supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

// Cache the user session for the duration of the request
export const getUser = cache(async () => {
  const supabase = await createClientFromRequest()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
})

// Get user or redirect to login if not authenticated
export async function requireUser() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

// Get session
export const getSession = cache(async () => {
  const supabase = await createClientFromRequest()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session
})

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getUser()
  return !!user
}

// Get user profile (jika Anda punya tabel profiles)
export async function getUserProfile() {
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const supabase = await createClientFromRequest()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

// Sign out
export async function signOut() {
  'use server'
  const supabase = await createClientFromRequest()
  await supabase.auth.signOut()
  redirect('/login')
}