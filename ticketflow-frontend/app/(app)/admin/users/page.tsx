'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface User {
  id: number
  email: string
  full_name: string
  is_staff: boolean
  is_active: boolean
  role: 'AG' | 'US'
}

const roleOptions = [
  { value: 'AG', label: 'Agent' },
  { value: 'US', label: 'Regular' },
]

export default function AdminUserManagementPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_staff)) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      fetchUsers()
    }
  }, [isAuthenticated, user])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.users.list()
      if (res.error) {
        setError(res.error.detail || 'Failed to load users')
        return
      }
      setUsers(res.data || [])
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: number, newRole: 'AG' | 'US') => {
    if (!user?.is_staff) return

    setUpdatingUserId(userId)
    try {
      const res = await api.users.updateRole(userId, newRole)
      if (res.error) {
        setError(res.error.detail || `Failed to update role for user ${userId}`)
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
      }
    } catch (err) {
      setError(`Failed to update role for user ${userId}`)
    } finally {
      setUpdatingUserId(null)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !user?.is_staff) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">User Management</h1>
            <Button asChild variant="outline">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {u.full_name || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Badge
                      variant="secondary"
                      className={`${
                        u.role === 'AG'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      } border`}
                    >
                      {u.role === 'AG' ? 'Agent' : 'Regular'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as 'AG' | 'US')
                      }
                      disabled={updatingUserId === u.id || !user?.is_staff}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {updatingUserId === u.id && (
                      <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-primary" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && !isLoading && !error && (
            <p className="text-center py-8 text-muted-foreground">No users found.</p>
        )}
      </main>
    </div>
  )
}
