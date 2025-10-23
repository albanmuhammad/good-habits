import { NextResponse } from 'next/server'

import { createClientFromRequest } from '@/lib/supabase/server'

const DEFAULT_REDIRECT_PATH = '/dashboard'

const getSafeRedirectUrl = (nextParam: string | null, requestUrl: URL): URL => {
  if (nextParam) {
    try {
      const redirectUrl = new URL(nextParam, requestUrl.origin)

      if (redirectUrl.origin === requestUrl.origin) {
        return redirectUrl
      }
    } catch {
      // fall through to default redirect
    }
  }

  return new URL(DEFAULT_REDIRECT_PATH, requestUrl.origin)
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const nextParam = requestUrl.searchParams.get('next')
  const redirectUrl = getSafeRedirectUrl(nextParam, requestUrl)

  const errorDescription = requestUrl.searchParams.get('error_description')
  const oauthError = requestUrl.searchParams.get('error')

  if (errorDescription || oauthError) {
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set(
      'error',
      errorDescription ?? oauthError ?? 'Autentikasi OAuth gagal.'
    )

    if (nextParam) {
      loginUrl.searchParams.set(
        'next',
        `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
      )
    }

    return NextResponse.redirect(loginUrl)
  }

  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClientFromRequest()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', error.message)

    if (nextParam) {
      loginUrl.searchParams.set(
        'next',
        `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
      )
    }

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(redirectUrl)
}