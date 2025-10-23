// middleware/auth.middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'
import type { User } from '@/types/auth'
import type {  ApiError } from '@/types/api/responses'

export async function withAuth(
  request: NextRequest,
  handler: (user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = await createClientFromRequest()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      )
    }
    
    return handler({
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name
    })
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Authentication failed'
        }
      },
      { status: 500 }
    )
  }
}