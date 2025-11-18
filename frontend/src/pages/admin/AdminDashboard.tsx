const stats = [
  { label: 'Pending requests', value: '24', trend: '+6 this week' },
  { label: 'MCQs crafted', value: '1.2k', trend: '+42 this month' },
  { label: 'Recommendations sent', value: '860', trend: '+18 this week' },
]

const highlights = [
  {
    title: 'AI vs Human Curiosity',
    student: 'Nishma Patel',
    due: 'Today · 5 PM',
    status: 'Need review',
  },
  {
    title: 'Design Strategy Pulse',
    student: 'Aditya Sharma',
    due: 'Tomorrow · 11 AM',
    status: 'Questions drafted',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <p className="text-sm text-slate-300">{stat.label}</p>
            <p className="mt-3 font-display text-4xl text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-brand-light">{stat.trend}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Workload</p>
            <h3 className="font-display text-2xl text-white">Focus queue</h3>
          </div>
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand">
            View requests
          </button>
        </div>
        <div className="space-y-4">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.student}</p>
                  <p className="font-semibold text-xl text-white">{item.title}</p>
                  <p className="text-sm text-slate-300">Due: {item.due}</p>
                </div>
                <span className="rounded-full bg-brand/20 px-4 py-2 text-xs font-semibold text-white">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
