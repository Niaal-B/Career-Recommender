const reviews = [
  {
    student: 'Pranav Mehta',
    test: 'Career Compass - Nov',
    selections: 12,
    status: 'Needs recommendation',
  },
  {
    student: 'Diya Iyer',
    test: 'Creative Decision Pulse',
    selections: 15,
    status: 'Draft roadmap',
  },
]

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Review studio</p>
          <h3 className="font-display text-2xl text-white">Answer decoding queue</h3>
        </div>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand">
          Auto-sort by urgency
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((item) => (
          <div key={item.student} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.test}</p>
            <p className="mt-2 font-semibold text-xl text-white">{item.student}</p>
            <p className="text-sm text-slate-300">Selections to decode: {item.selections}</p>
            <p className="text-sm text-brand-light">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
