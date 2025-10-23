// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ApiResponse, ApiError } from '@/types/api/responses'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = LoginSchema.parse(body)
    
    const supabase = await createClientFromRequest()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: error.message
          }
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
        },
        session: data.session,
      },
      message: 'Login successful'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.cause
          }
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Login failed'
        }
      },
      { status: 500 }
    )
  }
}