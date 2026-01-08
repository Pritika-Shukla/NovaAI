'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import toast from 'react-hot-toast'

function AuthToastHandlerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const authStatus = searchParams.get('auth')
    const message = searchParams.get('message')

    if (authStatus === 'success' && message) {
      toast.success(decodeURIComponent(message))
      const url = new URL(window.location.href)
      url.searchParams.delete('auth')
      url.searchParams.delete('message')
      router.replace(url.pathname + url.search)
    } else if (authStatus === 'error' && message) {
      toast.error(decodeURIComponent(message))
      const url = new URL(window.location.href)
      url.searchParams.delete('auth')
      url.searchParams.delete('message')
      router.replace(url.pathname + url.search)
    }
  }, [searchParams, router])

  return null
}

export default function AuthToastHandler() {
  return (
    <Suspense fallback={null}>
      <AuthToastHandlerInner />
    </Suspense>
  )
}

