'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, AlertCircle, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  created_at: string
  updated_at: string
  customer_email: string
  assigned_to?: any
}

interface Comment {
  id: number
  comment: string
  created_by: any
  created_at: string
}

const statusOptions = ['open', 'in_progress', 'on_hold', 'closed']
const priorityOptions = ['low', 'medium', 'high']

const statusColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  closed: 'bg-green-500/10 text-green-400 border-green-500/20',
  on_hold: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTicketAndComments()
    }
  }, [isAuthenticated])

  const fetchTicketAndComments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const ticketRes = await api.tickets.get(ticketId)
      if (ticketRes.error) {
        setError(ticketRes.error.detail || 'Failed to load ticket')
        return
      }
      setTicket(ticketRes.data)

      const commentsRes = await api.comments.list(ticketId)
      if (!commentsRes.error) {
        setComments(commentsRes.data || [])
      }
    } catch (err) {
      setError('Failed to load ticket')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    try {
      const res = await api.comments.create(ticketId, newComment)
      if (res.error) {
        setError(res.error.detail || 'Failed to add comment')
      } else {
        setNewComment('')
        await fetchTicketAndComments()
      }
    } catch (err) {
      setError('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!user?.is_staff) return

    setIsUpdatingStatus(true)
    try {
      const res = await api.tickets.updateStatus(ticketId, newStatus)
      if (res.error) {
        setError(res.error.detail || 'Failed to update status')
      } else {
        setTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err) {
      setError('Failed to update status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!user || (comments.find((c) => c.id === commentId)?.created_by.id !== user.id && !user.is_staff)) {
      return
    }

    try {
      const res = await api.comments.delete(commentId)
      if (res.error) {
        setError(res.error.detail || 'Failed to delete comment')
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    } catch (err) {
      setError('Failed to delete comment')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !ticket) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to tickets
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {ticket.title}
                </h1>
                <p className="mt-2 text-muted-foreground">{ticket.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className={`${statusColors[ticket.status] || 'bg-muted text-muted-foreground'} border`}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground border-t border-border pt-4">
              <div>
                <span className="font-medium text-foreground">From</span>
                <p>{ticket.customer_email}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Priority</span>
                <p className="capitalize">{ticket.priority}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Created</span>
                <p>{formatDate(ticket.created_at)}</p>
              </div>
              {ticket.assigned_to && (
                <div>
                  <span className="font-medium text-foreground">Assigned to</span>
                  <p>{ticket.assigned_to.full_name}</p>
                </div>
              )}
            </div>
          </div>

          {user?.is_staff && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Update Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assign Agent
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={isAssigningAgent}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select an agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.full_name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAssignAgent}
                    disabled={isAssigningAgent || selectedAgent === '' || (ticket.assigned_to && ticket.assigned_to.id === selectedAgent)}
                  >
                    {isAssigningAgent ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      'Assign'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Comments</h2>

              <form onSubmit={handleAddComment} className="mb-6 space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post comment
                    </>
                  )}
                </Button>
              </form>
            </div>

            {comments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {comment.created_by.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      {(user.id === comment.created_by.id || user.is_staff) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
