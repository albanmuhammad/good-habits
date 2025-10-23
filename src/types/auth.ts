// types/auth.ts atau types/index.ts
// Centralized types untuk seluruh aplikasi

import { User as SupabaseUser } from '@supabase/supabase-js'

// Base User type dari Supabase auth
export type AuthUser = SupabaseUser

// Extended User type untuk aplikasi Anda
export interface User {
  id: string
  email: string
  name?: string
  created_at?: string
  updated_at?: string
}

// Profile type (jika punya tabel profiles)
export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

// Session type
export interface Session {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: AuthUser
}

// Auth state
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

// Auth response types
export type AuthResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends SignInCredentials {
  name?: string
}