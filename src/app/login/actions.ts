'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export type AuthActionResult = {
  success: boolean
  message?: string
  error?: string
}

export async function login(formData: FormData): Promise<AuthActionResult> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Map common Supabase errors to user-friendly messages
    let errorMessage = error.message
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Please verify your email address before signing in.'
    } else if (error.message.includes('Too many requests')) {
      errorMessage = 'Too many login attempts. Please try again later.'
    }

    return {
      success: false,
      error: errorMessage,
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    message: 'Successfully signed in!',
  }
}

export async function signup(formData: FormData): Promise<AuthActionResult> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  if (data.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long',
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // Map common Supabase errors to user-friendly messages
    let errorMessage = error.message
    if (error.message.includes('User already registered')) {
      errorMessage = 'An account with this email already exists. Please sign in instead.'
    } else if (error.message.includes('Password')) {
      errorMessage = 'Password does not meet requirements. Please use a stronger password.'
    } else if (error.message.includes('email')) {
      errorMessage = 'Please enter a valid email address.'
    }

    return {
      success: false,
      error: errorMessage,
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    message: 'Account created successfully!',
  }
}

export async function logout(): Promise<AuthActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      error: 'Failed to sign out. Please try again.',
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    message: 'Successfully signed out!',
  }
}