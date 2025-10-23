// lib/auth.ts
import { createClientFromRequest } from './supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { User, UserProfile, Session } from '@/types/auth'

// Cache the user session for the duration of the request
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClientFromRequest()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  // Map Supabase user to your User type
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.name,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
})

// Get user or redirect to login if not authenticated
export async function requireUser(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

// Get session
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClientFromRequest()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session
})


// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return !!user
}

// Get user profile (jika Anda punya tabel profiles)
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const supabase = await createClientFromRequest()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single<UserProfile>()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

// Sign out
export async function signOut(): Promise<void> {
  'use server'
  const supabase = await createClientFromRequest()
  await supabase.auth.signOut()
  redirect('/login')
}