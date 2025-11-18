const requests = [
  {
    id: 'REQ-2025-01',
    student: 'Riya Prakash',
    cohort: 'Grade 12',
    submitted: 'Today 10:45 AM',
    focus: 'Design + Business',
    status: 'Needs MCQs',
  },
  {
    id: 'REQ-2025-02',
    student: 'Aditya Sharma',
    cohort: 'B.Tech Year 3',
    submitted: 'Yesterday 7:30 PM',
    focus: 'AI + Psychology',
    status: 'In progress',
  },
]

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Queue</p>
          <h3 className="font-display text-2xl text-white">Pending student requests</h3>
        </div>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand">
          Assign mentor
        </button>
      </div>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{request.id}</p>
                <p className="font-semibold text-xl text-white">{request.student}</p>
                <p className="text-sm text-slate-300">Focus: {request.focus}</p>
                <p className="text-xs text-slate-500">{request.cohort} · {request.submitted}</p>
              </div>
              <span className="rounded-full bg-brand/20 px-4 py-2 text-xs font-semibold text-white">{request.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
