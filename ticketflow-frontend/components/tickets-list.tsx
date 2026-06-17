'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react'

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
  priority: string
  customer_email: string
  assigned_to?: any
}

interface TicketsListProps {
  isStaff?: boolean
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-green-500/10 text-green-400 border-green-500/20',
  on_hold: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertCircle className="h-4 w-4 text-blue-400" />,
  in_progress: <Clock className="h-4 w-4 text-yellow-400" />,
  resolved: <CheckCircle className="h-4 w-4 text-green-400" />,
  closed: <CheckCircle className="h-4 w-4 text-green-400" />,
}

const priorityColors: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

export default function TicketsList({ isStaff = false }: TicketsListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchTickets()
  }, [filter])

  const fetchTickets = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await api.tickets.list(params)
      if (response.error) {
        setError(response.error.detail || 'Failed to load tickets')
        setTickets([])
      } else {
        setTickets(response.data || [])
      }
    } catch (err) {
      setError('Failed to load tickets')
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          All
        </Button>
        <Button
          variant={filter === 'open' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('open')}
          className="text-xs"
        >
          Open
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('in_progress')}
          className="text-xs"
        >
          In Progress
        </Button>
        <Button
          variant={filter === 'resolved' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('resolved')}
          className="text-xs"
        >
          Resolved
        </Button>
        <Button
          variant={filter === 'closed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('closed')}
          className="text-xs"
        >
          Closed
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading tickets...</div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <div className="group rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary hover:bg-card/80">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
                          {ticket.title}
                        </h3>
                        {statusIcons[ticket.status] && (
                          <span title={`Status: ${ticket.status.replace('_', ' ')}`}>
                            {statusIcons[ticket.status]}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase tracking-wider font-bold ${priorityColors[ticket.priority] || 'text-muted-foreground'}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <span>{ticket.customer_email}</span>
                        <span>•</span>
                        <span>{formatDate(ticket.created_at)}</span>
                        {ticket.assigned_to && isStaff && (
                          <>
                            <span>•</span>
                            <span>Assigned to {ticket.assigned_to.full_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={`${statusColors[ticket.status] || 'bg-muted text-muted-foreground'} border`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      )}
    </div>
  )
}