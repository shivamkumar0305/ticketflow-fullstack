'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Full name</p>
              <p className="text-lg text-foreground">{user.full_name}</p>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg text-foreground">{user.email}</p>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-lg text-foreground">
                {user.is_staff ? 'Staff Member' : 'Customer'}
              </p>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
              <p className="text-sm font-medium text-muted-foreground">Account status</p>
              <p className="text-lg text-foreground">
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="default"
            className="gap-2 w-full"
            size="lg"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </main>
    </div>
  )
}
