'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

interface Ticket {
  id: number
  title: string
  status: string
  priority: string
  customer_email: string
  assigned_to?: any
  created_at: string
}

interface StaffMember {
  id: number
  full_name: string
  email: string
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  closed: 'bg-green-500/10 text-green-400 border-green-500/20',
  on_hold: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [assigningTicketId, setAssigningTicketId] = useState<number | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_staff)) {
      router.push('/')
    }
  }, [authLoading, isAuthenticated, user?.is_staff, router])

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      fetchData()
    }
  }, [isAuthenticated, user?.is_staff, filter])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const [ticketsRes, staffRes] = await Promise.all([
        api.tickets.list(params),
        api.staff.list(),
      ])

      if (ticketsRes.error) {
        setError(ticketsRes.error.detail || 'Failed to load tickets')
        setTickets([])
      } else {
        setTickets(ticketsRes.data || [])
      }

      if (!staffRes.error) {
        setStaffMembers(staffRes.data || [])
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignTicket = async (ticketId: number, staffId: number) => {
    try {
      const res = await api.tickets.assign(ticketId, staffId)
      if (res.error) {
        setError(res.error.detail || 'Failed to assign ticket')
      } else {
        setAssigningTicketId(null)
        setSelectedStaff(null)
        await fetchData()
      }
    } catch (err) {
      setError('Failed to assign ticket')
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

  const unassignedCount = tickets.filter((t) => !t.assigned_to).length
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length
  const openCount = tickets.filter((t) => t.status === 'open').length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage all tickets and assignments
              </p>
            </div>
            <Link href="/app">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
            <p className="text-3xl font-bold text-foreground mt-2">{tickets.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{unassignedCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{inProgressCount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              All ({tickets.length})
            </Button>
            <Button
              variant={filter === 'open' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('open')}
              className="text-xs"
            >
              Open ({openCount})
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('in_progress')}
              className="text-xs"
            >
              In Progress ({inProgressCount})
            </Button>
          </div>

          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-border bg-card">
              <p className="text-sm text-muted-foreground">No tickets found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-border bg-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/tickets/${ticket.id}`} className="flex-1">
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                        {ticket.title}
                      </h3>
                    </Link>
                    <Badge
                      variant="secondary"
                      className={`${statusColors[ticket.status] || 'bg-muted text-muted-foreground'} border`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">From</p>
                      <p>{ticket.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Priority</p>
                      <p className="capitalize">{ticket.priority}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    {!ticket.assigned_to ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-yellow-400">Unassigned</p>
                        {assigningTicketId === ticket.id ? (
                          <div className="flex gap-2">
                            <select
                              value={selectedStaff || ''}
                              onChange={(e) => setSelectedStaff(Number(e.target.value))}
                              className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                            >
                              <option value="">Select staff...</option>
                              {staffMembers.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.full_name}
                                </option>
                              ))}
                            </select>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (selectedStaff) {
                                  handleAssignTicket(ticket.id, selectedStaff)
                                }
                              }}
                              className="text-xs"
                            >
                              Assign
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setAssigningTicketId(null)
                                setSelectedStaff(null)
                              }}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAssigningTicketId(ticket.id)}
                            className="text-xs"
                          >
                            Assign to staff
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">
                          Assigned to
                        </p>
                        <p className="text-sm text-green-400">{ticket.assigned_to.full_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
