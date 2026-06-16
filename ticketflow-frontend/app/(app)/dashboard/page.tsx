'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TicketsList from '@/components/tickets-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, LogOut } from 'lucide-react'

export default function AppPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  console.log("AppPage render: isLoading", isLoading, "isAuthenticated", isAuthenticated, "user", user);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Tickets
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.full_name}
                {user?.is_staff && ' (Staff)'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Ticket
                </Button>
              </Link>
              {user?.is_staff && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TicketsList isStaff={user?.is_staff || false} />
      </main>
    </div>
  )
}
