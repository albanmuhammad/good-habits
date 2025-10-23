// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ApiResponse, ApiError } from '@/types/api/responses'

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = RegisterSchema.parse(body)
    
    const supabase = await createClientFromRequest()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
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
        { status: 400 }
      )
    }
    
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name,
          } : null,
        },
        message: 'Registration successful. Please check your email to verify your account.'
      },
      { status: 201 }
    )
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
          message: 'Registration failed'
        }
      },
      { status: 500 }
    )
  }
}