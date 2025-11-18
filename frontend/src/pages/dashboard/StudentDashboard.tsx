import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import {
  createStudentTestRequest,
  fetchStudentDashboard,
  fetchStudentRequests,
} from '../../services/dashboard'

type TestRequest = {
  id: number
  status: string
  created_at: string
  interests_snapshot: string
}

type DashboardResponse = {
  user: unknown
  latest_request: TestRequest | null
  personalized_test: {
    id: number
    status: string
    questions: Array<{
      id: number
      prompt: string
      order: number
      options: Array<{ id: number; label: string }>
    }>
  } | null
  recommendation: {
    career_name: string
    summary: string
    steps: Array<{ id: number; order: number; title: string; description: string }>
  } | null
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [requests, setRequests] = useState<TestRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashboardData, requestData] = await Promise.all([fetchStudentDashboard(), fetchStudentRequests()])
      setDashboard(dashboardData)
      setRequests(requestData)
    } catch (err) {
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRequestTest = async () => {
    if (!user) return
    setActionLoading(true)
    setError(null)
    setMessage(null)
    try {
      await createStudentTestRequest({
        interests_snapshot: user.interests ?? '',
        qualification_snapshot: user.qualification ?? '',
      })
      setMessage('Request sent! We will craft your MCQs soon.')
      await loadData()
    } catch (err) {
      setError('Unable to create request right now.')
    } finally {
      setActionLoading(false)
    }
  }

  const hasActiveRequest = useMemo(
    () => requests.some((request) => request.status !== 'completed'),
    [requests],
  )

  const latestStatusLabel = (() => {
    if (!requests.length) return 'No requests yet'
    const status = requests[0].status
    if (status === 'pending') return 'Request received'
    if (status === 'in_progress') return 'Mentor crafting MCQs'
    if (status === 'completed') return 'Recommendation ready'
    return status
  })()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Profile</p>
          <p className="mt-2 font-display text-4xl text-ink">{user?.qualification || 'Learner'}</p>
          <p className="mt-3 text-sm text-slate-600">Interests: {user?.interests || 'Add your interests'}</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand" to="#">
            Edit profile →
          </Link>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Next milestone</p>
          <p className="mt-2 font-display text-4xl text-ink">Request test</p>
          <p className="mt-3 text-sm text-slate-600">Get a new handcrafted MCQ experience.</p>
          <button
            onClick={handleRequestTest}
            disabled={actionLoading || hasActiveRequest}
            className="mt-4 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand/30 drop-shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? 'Requesting...' : hasActiveRequest ? 'Waiting for current test' : 'Request personalized test'}
          </button>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Latest status</p>
          <p className="mt-2 font-display text-4xl text-ink">{latestStatusLabel}</p>
          <p className="mt-3 text-sm text-slate-600">
            {requests[0]?.status === 'completed'
              ? 'Your recommendation is ready to review.'
              : 'We will notify you when mentors publish your roadmap.'}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-brand">Avg. turnaround &lt; 48h</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-glass lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Requests</p>
              <h3 className="font-display text-2xl text-ink">Test request timeline</h3>
            </div>
          </div>
          <div className="space-y-4">
            {requests.length === 0 && (
              <p className="rounded-3xl border border-dashed border-brand/30 bg-brand/5 p-6 text-sm text-slate-500">
                You have not requested a personalized test yet. Click “Request test” to get started.
              </p>
            )}
            {requests.map((request) => (
              <div key={request.id} className="rounded-3xl border border-slate-100 bg-white/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                    <p className="font-semibold text-xl text-ink">Personalized MCQ request</p>
                    <p className="text-sm text-slate-600">
                      {request.interests_snapshot ? `Focus: ${request.interests_snapshot}` : 'Awaiting interests snapshot'}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Roadmap snapshot</p>
          <h3 className="mt-3 font-display text-2xl text-ink">
            {dashboard?.recommendation?.career_name ?? 'Waiting for recommendation'}
          </h3>
          <ol className="mt-6 space-y-4">
            {(dashboard?.recommendation?.steps ?? []).map((step) => (
              <li key={step.id} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 font-display text-brand">
                  {String(step.order).padStart(2, '0')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </li>
            ))}
            {(!dashboard?.recommendation || dashboard.recommendation.steps.length === 0) && (
              <p className="text-sm text-slate-500">
                Once your mentor publishes a roadmap, the steps will appear here.
              </p>
            )}
          </ol>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Recommendation</p>
            <h3 className="font-display text-2xl text-ink">
              {dashboard?.recommendation?.career_name ?? 'Your personalized guidance'}
            </h3>
            <p className="text-sm text-slate-600">
              {dashboard?.recommendation?.summary ??
                'Stay tuned—once mentors finish decoding your latest test, your roadmap will update here.'}
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-sm text-muted">
            Logged in as <span className="font-semibold text-brand">{user?.email}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
