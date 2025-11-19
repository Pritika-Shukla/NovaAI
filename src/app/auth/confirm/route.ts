import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app with success message
      const redirectUrl = `${origin}${next}?auth=success&message=${encodeURIComponent('Email verified successfully!')}`
      redirect(redirectUrl)
    } else {
      // Redirect with error message
      const errorMessage = error.message.includes('expired') 
        ? 'Verification link has expired. Please request a new one.'
        : 'Failed to verify email. Please try again.'
      redirect(`${origin}/login?auth=error&message=${encodeURIComponent(errorMessage)}`)
    }
  }

  // redirect the user to login with error message
  redirect(`${origin}/login?auth=error&message=${encodeURIComponent('Invalid verification link. Please try again.')}`)
}