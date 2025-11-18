import { useEffect, useState } from 'react'

import { fetchStudentRequests } from '../../services/dashboard'

type TestRequest = {
  id: number
  status: string
  interests_snapshot: string
  qualification_snapshot: string
  created_at: string
  personalized_test?: {
    id: number
    status: string
    assigned_at: string
  }
}

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState<TestRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true)
        const data = await fetchStudentRequests()
        setRequests(data.results || data)
      } catch (err: any) {
        setError(err?.response?.data?.detail ?? 'Unable to load test requests.')
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Awaiting MCQs', className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'MCQs in progress', className: 'bg-blue-100 text-blue-800' },
      assigned: { label: 'Test ready', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', className: 'bg-purple-100 text-purple-800' },
    }
    const config = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`rounded-full px-4 py-2 text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[2.5rem] border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand">History</p>
          <h3 className="font-display text-2xl text-ink">Your test requests</h3>
        </div>
        <p className="text-sm text-muted">{requests.length} request{requests.length !== 1 ? 's' : ''} total</p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-10 text-center shadow-glass">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">No requests yet</p>
          <h3 className="mt-4 font-display text-2xl text-ink">Start your journey</h3>
          <p className="mt-3 text-slate-600">Request a personalized test from the overview page to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-glass">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    {getStatusBadge(request.status)}
                    <p className="text-xs text-muted">Requested {formatDate(request.created_at)}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Qualification</p>
                      <p className="font-semibold text-ink">{request.qualification_snapshot || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Interests</p>
                      <p className="text-sm text-slate-600">{request.interests_snapshot || 'Not specified'}</p>
                    </div>
                    {request.personalized_test && (
                      <div className="mt-3 rounded-2xl border border-brand/20 bg-brand/5 p-3">
                        <p className="text-xs font-semibold text-brand">Test assigned</p>
                        <p className="text-sm text-slate-600">
                          Status: {request.personalized_test.status} · Assigned{' '}
                          {formatDate(request.personalized_test.assigned_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
