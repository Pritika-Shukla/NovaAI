import { createClient } from '@/app/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before reverse proxy
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const redirectUrl = isLocalEnv
        ? `${origin}${next}?auth=success&message=${encodeURIComponent('Successfully signed in with Google!')}`
        : forwardedHost
        ? `https://${forwardedHost}${next}?auth=success&message=${encodeURIComponent('Successfully signed in with Google!')}`
        : `${origin}${next}?auth=success&message=${encodeURIComponent('Successfully signed in with Google!')}`
      return NextResponse.redirect(redirectUrl)
    } else {
      // Redirect with error message
      const errorMessage = error.message.includes('expired') 
        ? 'Authentication link has expired. Please try again.'
        : 'Failed to sign in with Google. Please try again.'
      return NextResponse.redirect(`${origin}/login?auth=error&message=${encodeURIComponent(errorMessage)}`)
    }
  }

  // return the user to login with error message
  return NextResponse.redirect(`${origin}/login?auth=error&message=${encodeURIComponent('Invalid authentication code. Please try again.')}`)
}

