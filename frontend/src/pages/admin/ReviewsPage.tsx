import { useEffect, useState } from 'react'

import { createRecommendation, fetchCompletedTests, fetchTestAnswers } from '../../services/dashboard'

type CompletedTest = {
  id: number
  request_id: number
  student: {
    email: string
    qualification: string
    interests: string
  }
  completed_at: string
  questions_count: number
  has_recommendation: boolean
}

type Answer = {
  question: {
    id: number
    prompt: string
    order: number
  }
  options: Array<{
    id: number
    label: string
    description: string
    order: number
  }>
  selected_answer: {
    option_id: number
    option_label: string
  } | null
}

type TestAnswers = {
  test: {
    id: number
    request_id: number
    student: {
      email: string
      qualification: string
      interests: string
    }
    completed_at: string
    answers: Answer[]
  }
}

export default function ReviewsPage() {
  const [tests, setTests] = useState<CompletedTest[]>([])
  const [selectedTest, setSelectedTest] = useState<TestAnswers | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAnswers, setLoadingAnswers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRecommendationForm, setShowRecommendationForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [recommendation, setRecommendation] = useState({
    career_name: '',
    summary: '',
    steps: [{ order: 1, title: '', description: '' }],
  })

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true)
        const data = await fetchCompletedTests()
        setTests(data.tests || [])
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } }
        setError(error?.response?.data?.detail || 'Unable to load completed tests.')
      } finally {
        setLoading(false)
      }
    }
    loadTests()
  }, [])

  const handleViewAnswers = async (testId: number) => {
    try {
      setLoadingAnswers(true)
      const data = await fetchTestAnswers(testId)
      setSelectedTest(data)
      setShowRecommendationForm(false)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error?.response?.data?.detail || 'Unable to load test answers.')
    } finally {
      setLoadingAnswers(false)
    }
  }

  const handleAddStep = () => {
    setRecommendation((prev) => ({
      ...prev,
      steps: [...prev.steps, { order: prev.steps.length + 1, title: '', description: '' }],
    }))
  }

  const handleRemoveStep = (index: number) => {
    setRecommendation((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i + 1 })),
    }))
  }

  const handleUpdateStep = (index: number, field: 'title' | 'description', value: string) => {
    setRecommendation((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
    }))
  }

  const handleCreateRecommendation = async () => {
    if (!selectedTest || !recommendation.career_name.trim() || !recommendation.summary.trim()) {
      setError('Please fill in career name and summary.')
      return
    }
    if (recommendation.steps.some((step) => !step.title.trim())) {
      setError('Please fill in all step titles.')
      return
    }
    try {
      setCreating(true)
      await createRecommendation(selectedTest.test.id, recommendation)
      setShowRecommendationForm(false)
      setError(null)
      const data = await fetchCompletedTests()
      setTests(data.tests || [])
      setSelectedTest(null)
      setRecommendation({
        career_name: '',
        summary: '',
        steps: [{ order: 1, title: '', description: '' }],
      })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string; detail?: string } } }
      setError(error?.response?.data?.error || error?.response?.data?.detail || 'Failed to create recommendation.')
    } finally {
      setCreating(false)
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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
      </div>
    )
  }

  if (error && !selectedTest) {
    return (
      <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/10 p-6 text-center">
        <p className="text-red-200">{error}</p>
      </div>
    )
  }

  if (selectedTest) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => {
                setSelectedTest(null)
                setShowRecommendationForm(false)
                setError(null)
              }}
              className="mb-4 text-sm text-slate-300 hover:text-white"
            >
              ← Back to reviews
            </button>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Review studio</p>
            <h3 className="font-display text-2xl text-white">Test answers</h3>
            <p className="mt-1 text-sm text-slate-300">Student: {selectedTest.test.student.email}</p>
          </div>
          {!showRecommendationForm && (
            <button
              onClick={() => setShowRecommendationForm(true)}
              className="rounded-full border border-brand bg-brand/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand/30"
            >
              Create recommendation
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {showRecommendationForm ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
              <h4 className="mb-4 text-lg font-semibold text-white">Create career recommendation</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Career name</label>
                  <input
                    type="text"
                    value={recommendation.career_name}
                    onChange={(e) => setRecommendation((prev) => ({ ...prev, career_name: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Summary</label>
                  <textarea
                    value={recommendation.summary}
                    onChange={(e) => setRecommendation((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                    rows={4}
                    placeholder="Explain why this career is a good fit..."
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Roadmap steps</label>
                    <button
                      onClick={handleAddStep}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      + Add step
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recommendation.steps.map((step, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Step {step.order}</span>
                          {recommendation.steps.length > 1 && (
                            <button
                              onClick={() => handleRemoveStep(index)}
                              className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                          className="mb-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          placeholder="Step title"
                        />
                        <textarea
                          value={step.description}
                          onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          rows={2}
                          placeholder="Step description"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateRecommendation}
                    disabled={creating}
                    className="rounded-full border border-brand bg-brand/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand/30 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create recommendation'}
                  </button>
                  <button
                    onClick={() => setShowRecommendationForm(false)}
                    className="rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedTest.test.answers.map((answer) => (
              <div key={answer.question.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                  Question {answer.question.order + 1}
                </p>
                <h4 className="mb-4 text-lg font-semibold text-white">{answer.question.prompt}</h4>
                <div className="space-y-2">
                  {answer.options.map((option) => {
                    const isSelected = answer.selected_answer?.option_id === option.id
                    return (
                      <div
                        key={option.id}
                        className={`rounded-2xl border p-3 ${
                          isSelected
                            ? 'border-brand bg-brand/20'
                            : 'border-white/10 bg-black/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                              isSelected ? 'border-brand bg-brand' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="h-full w-full rounded-full bg-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-brand-light' : 'text-slate-200'}`}>
                              {option.label}
                            </p>
                            {option.description && (
                              <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                            )}
                          </div>
                          {isSelected && (
                            <span className="rounded-full bg-brand/30 px-2 py-1 text-xs font-semibold text-brand-light">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Review studio</p>
          <h3 className="font-display text-2xl text-white">Answer decoding queue</h3>
        </div>
        <p className="text-sm text-slate-300">{tests.length} completed test{tests.length !== 1 ? 's' : ''}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {tests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-slate-300">
          <p className="text-sm uppercase tracking-[0.3em]">No completed tests</p>
          <p className="mt-2">Completed tests will appear here for review.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tests.map((test) => (
            <div
              key={test.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Test #{test.id}</p>
              <p className="mt-2 font-semibold text-xl text-white">{test.student.email}</p>
              <p className="text-sm text-slate-300">
                {test.questions_count} question{test.questions_count !== 1 ? 's' : ''} · Completed{' '}
                {formatDate(test.completed_at)}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewAnswers(test.id)}
                  disabled={loadingAnswers}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  {loadingAnswers ? 'Loading...' : 'View answers'}
                </button>
                {test.has_recommendation && (
                  <span className="rounded-full bg-green-500/20 px-4 py-2 text-xs font-semibold text-green-200">
                    Recommendation created
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
