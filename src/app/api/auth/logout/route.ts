// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'
import type { ApiResponse, ApiError } from '@/types/api/responses'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientFromRequest()
    const { error } = await supabase.auth.signOut()
    
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
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: null,
      message: 'Logout successful'
    })
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Logout failed'
        }
      },
      { status: 500 }
    )
  }
}