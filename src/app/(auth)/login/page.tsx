'use client'

import { login } from '@/app/(auth)/login/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import OneTapComponent from '@/components/OneTapComponent'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import AuthToastHandler from '@/components/AuthToastHandler'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await login(formData)
      
      if (result.success) {
        toast.success(result.message || 'Successfully signed in!')
        router.push('/')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to sign in. Please try again.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthToastHandler />
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-400">
              Sign in to your account to continue
            </p>
          </div>
          
          <GoogleLoginButton />
          <OneTapComponent />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all bg-zinc-950 text-white placeholder-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent outline-none transition-all bg-zinc-950 text-white placeholder-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </button>
              <div className="text-center text-sm">
                <span className="text-zinc-400">
                  Don&apos;t have an account?{' '}
                </span>
                <Link
                  href="/signup"
                  className="font-medium text-white hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}