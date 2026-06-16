'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  console.log("Root Page Render: isLoading", isLoading, "isAuthenticated", isAuthenticated, "isReady", isReady);

  useEffect(() => {
    console.log("Root Page useEffect: isLoading", isLoading, "isAuthenticated", isAuthenticated);
    if (!isLoading) {
      if (isAuthenticated) {
        console.log("Root Page: Authenticated, redirecting to /dashboard");
        router.push('/dashboard')
      } else {
        console.log("Root Page: Unauthenticated, redirecting to /login");
        router.push('/login')
      }
      setIsReady(true)
    }

  }, [isLoading, isAuthenticated, router])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  console.log("Root Page: Returning null after redirect/initial state");
  return null
}
