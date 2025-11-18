const draftQuestions = [
  {
    id: 'Q1',
    prompt: 'Which scenario energizes you the most on a Monday morning?',
    options: ['Launching a feature', 'Design jam with peers', 'User interviews', 'Strategy whiteboard'],
  },
]

export default function QuestionBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Creation lab</p>
          <h3 className="font-display text-2xl text-white">MCQ builder</h3>
        </div>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand">
          Save draft
        </button>
      </div>
      <div className="space-y-4">
        {draftQuestions.map((question) => (
          <div key={question.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{question.id}</p>
            <p className="mt-2 font-semibold text-xl text-white">{question.prompt}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {question.options.map((option) => (
                <li key={option} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
