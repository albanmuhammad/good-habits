// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClientFromRequest } from '@/lib/supabase/server'
import type { ApiError, ApiResponse } from '@/types/api/responses'
import { upsertToSfmcContactDE } from '@/lib/sfmc/upsertContact';
// import { upsertToSfmcContactDE } from '@/lib/sfmc/UpsertContact';

const SFMC_CLIENT_ID = process.env.SFMC_CLIENT_ID;
const SFMC_CLIENT_SECRET = process.env.SFMC_CLIENT_SECRET;
const SFMC_AUTH_URL = process.env.SFMC_AUTH_URL; // misal: 'https://xxxx.auth.marketingcloudapis.com/v2/token'
const SFMC_API_URL_BASE = process.env.SFMC_API_URL_BASE; // misal: 'https://xxxx.rest.marketingcloudapis.com'

async function getSfmAccessToken() {
  if (!SFMC_AUTH_URL || !SFMC_CLIENT_ID || !SFMC_CLIENT_SECRET) {
    throw new Error('Missing SFMC auth environment variables');
  }

  const response = await fetch(SFMC_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SFMC_CLIENT_ID,
      client_secret: SFMC_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    console.error('SFMC Auth Error:', await response.text());
    throw new Error('Gagal otentikasi dengan SFMC.');
  }

  const data = await response.json();
  return data.access_token;
}

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

      try {
        const userId = data.user?.id
        await upsertToSfmcContactDE({
          contactKey: userId!,
          email,
          name
        })
      } catch (err) {
        console.error('SFMC sync error:', err)
        // NOTE: Tidak gagal register walau SFMC error
      }
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