// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth.middleware'
import type { ApiResponse } from '@/types/api/responses'
import type { User } from '@/types/auth'

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user
    })
  })
}