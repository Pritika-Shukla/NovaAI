'use client'

import { signup } from '@/app/login/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await signup(formData)
      
      if (result.success) {
        toast.success(result.message || 'Account created successfully!')
        router.push('/')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create account. Please try again.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-black border border-black dark:border-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Create an account
            </h1>
            <p className="text-black dark:text-white opacity-70">
              Sign up to get started
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-black dark:text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-black dark:border-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white placeholder-black dark:placeholder-white placeholder-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-black dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-4 py-2.5 border border-black dark:border-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white placeholder-black dark:placeholder-white placeholder-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password (min. 6 characters)"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black dark:bg-white hover:opacity-80 text-white dark:text-black font-medium py-2.5 px-4 rounded-lg transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
              <div className="text-center text-sm">
                <span className="text-black dark:text-white opacity-70">
                  Already have an account?{' '}
                </span>
                <Link
                  href="/login"
                  className="font-medium text-black dark:text-white hover:underline"
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

