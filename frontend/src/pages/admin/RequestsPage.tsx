import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createPersonalizedTest, fetchAdminTestRequests } from '../../services/dashboard'

type AdminRequest = {
  id: number
  status: string
  created_at: string
  student: {
    email: string
    qualification: string
    interests: string
  }
  interests_snapshot: string
  qualification_snapshot: string
}

export default function RequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState<number | null>(null)

  const loadRequests = async (status?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminTestRequests(status)
      setRequests(data)
    } catch {
      setError('Unable to load requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests(statusFilter)
  }, [statusFilter])

  const handleCreateTest = async (requestId: number) => {
    setCreating(requestId)
    try {
      const data = await createPersonalizedTest(requestId)
      navigate(`/admin/questions?testId=${data.test.id}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { test?: { id: number }; message?: string } } }
      if (error?.response?.data?.test) {
        navigate(`/admin/questions?testId=${error.response.data.test.id}`)
      } else {
        setError(error?.response?.data?.message || 'Failed to create test.')
      }
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Queue</p>
          <h3 className="font-display text-2xl text-white">Pending student requests</h3>
        </div>
        <div className="flex gap-2">
          {['pending', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? undefined : status)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                statusFilter === status
                  ? 'border-brand bg-brand/20 text-white'
                  : 'border-white/20 text-slate-300 hover:border-brand'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <div className="space-y-4">
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center text-sm text-slate-300">
            Loading requests...
          </div>
        )}
        {!loading && requests.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-5 text-center text-sm text-slate-300">
            No requests match this filter.
          </div>
        )}
        {requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ID {request.id}</p>
                <p className="font-semibold text-xl text-white">{request.student.email}</p>
                <p className="text-sm text-slate-300">
                  Focus: {request.interests_snapshot || request.student.interests || 'Not provided'}
                </p>
                <p className="text-xs text-slate-500">
                  {request.qualification_snapshot || request.student.qualification || 'Learner'} ·{' '}
                  {new Date(request.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-brand/20 px-4 py-2 text-xs font-semibold text-white">
                  {request.status.replace('_', ' ')}
                </span>
                {request.status === 'pending' && (
                  <button
                    onClick={() => handleCreateTest(request.id)}
                    disabled={creating === request.id}
                    className="rounded-full border border-brand bg-brand/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand/30 disabled:opacity-50"
                  >
                    {creating === request.id ? 'Creating...' : 'Create test'}
                  </button>
                )}
                {request.status === 'in_progress' && (
                  <button
                    onClick={() => navigate(`/admin/questions?requestId=${request.id}`)}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    Build MCQs
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
