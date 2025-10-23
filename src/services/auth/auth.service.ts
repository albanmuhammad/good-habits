import axios from 'axios'
import type { Provider, Session } from '@supabase/supabase-js'

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { supabase } from '@/lib/supabase/client'
import type { AuthResult, SignInCredentials, SignUpCredentials } from '@/types/auth'
import type { ApiError } from '@/types/api/responses'

interface AuthUserResponse {
  id: string
  email: string | null
  name?: string | null
}

interface LoginResponse {
  user: AuthUserResponse
  session: Session | null
}

interface RegisterResponse {
  user: AuthUserResponse | null
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiError>(error)) {
    return (
      error.response?.data?.error?.message ||
      error.message ||
      fallback
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export const authService = {
  async login(credentials: SignInCredentials): Promise<AuthResult<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials)

      return { success: true, data: response.data, message: response.message }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Gagal masuk. Silakan coba lagi.'),
      }
    }
  },

  async register(credentials: SignUpCredentials): Promise<AuthResult<RegisterResponse>> {
    try {
      const response = await apiClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, credentials)

      return { success: true, data: response.data, message: response.message }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Gagal membuat akun. Silakan coba lagi.'),
      }
    }
  },

  async logout(): Promise<AuthResult<null>> {
    try {
      const response = await apiClient.post<null>(API_ENDPOINTS.auth.logout)
      return { success: true, data: response.data ?? null, message: response.message }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Gagal keluar. Silakan coba lagi.'),
      }
    }
  },

  async signInWithOAuth(provider: Provider, redirectTo?: string): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      })

      if (error) {
        throw error
      }

      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Gagal memulai proses OAuth.'),
      }
    }
  },
}