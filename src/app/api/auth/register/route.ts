// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClientFromRequest } from '@/lib/supabase/server'
import type { ApiError, ApiResponse } from '@/types/api/responses'

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
            message: error.message,
          },
        },
        { status: 400 }
      )
    }

    const identities = data.user?.identities ?? []
    if (identities.length === 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'Email sudah terdaftar. Silakan masuk.',
          },
        },
        { status: 409 }
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: data.user
            ? {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
              }
            : null,
        },
        message: data.user?.confirmed_at
          ? 'Registration successful.'
          : 'Registration successful. Please check your email to verify your account.',
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
            details: error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Registration failed',
        },
      },
      { status: 500 }
    )
  }
}