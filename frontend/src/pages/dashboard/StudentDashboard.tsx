import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const mockTests = [
  {
    id: 1,
    title: 'Design Thinking Focus',
    status: 'Awaiting MCQs',
    requestedOn: 'Nov 15, 2025',
    nextStep: 'Admin crafting questions',
  },
  {
    id: 2,
    title: 'Product Strategy Pulse',
    status: 'Completed',
    requestedOn: 'Oct 30, 2025',
    nextStep: 'Review recommendation',
  },
]

const roadmapSteps = [
  'Explore UX foundations with curated playlists',
  'Shadow a mentor during January sprint',
  'Start design journal & monthly portfolio reviews',
]

export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Profile completion</p>
          <p className="mt-2 font-display text-4xl text-ink">82%</p>
          <p className="mt-3 text-sm text-slate-600">Update interests to help mentors tailor MCQs.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand" to="#">
            Edit profile →
          </Link>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Next milestone</p>
          <p className="mt-2 font-display text-4xl text-ink">Request test</p>
          <p className="mt-3 text-sm text-slate-600">Get a new handcrafted MCQ experience.</p>
          <button className="mt-4 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand/30 drop-shadow">
            Request personalized test
          </button>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-glass">
          <p className="text-sm text-muted">Latest status</p>
          <p className="mt-2 font-display text-4xl text-ink">In review</p>
          <p className="mt-3 text-sm text-slate-600">Your last submission is being decoded by mentors.</p>
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
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {mockTests.map((test) => (
              <div key={test.id} className="rounded-3xl border border-slate-100 bg-white/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">{test.requestedOn}</p>
                    <p className="font-semibold text-xl text-ink">{test.title}</p>
                    <p className="text-sm text-slate-600">{test.nextStep}</p>
                  </div>
                  <span className="rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Roadmap snapshot</p>
          <h3 className="mt-3 font-display text-2xl text-ink">What’s next</h3>
          <ol className="mt-6 space-y-4">
            {roadmapSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 font-display text-brand">
                  0{index + 1}
                </div>
                <p className="text-sm text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Recommendation</p>
            <h3 className="font-display text-2xl text-ink">Your personalized guidance</h3>
            <p className="text-sm text-slate-600">Stay tuned—once mentors finish decoding your latest test, your roadmap will update here.</p>
          </div>
          <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-sm text-muted">
            Logged in as <span className="font-semibold text-brand">{user?.email}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
