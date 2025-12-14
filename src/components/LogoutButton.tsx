'use client'

import { logout } from '@/app/login/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const result = await logout()
      
      if (result.success) {
        toast.success(result.message || 'Successfully signed out!')
        router.push('/login')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to sign out. Please try again.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      type="button"
      className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:opacity-80 rounded-lg transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing out...' : 'Logout'}
    </button>
  )
}

