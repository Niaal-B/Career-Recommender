import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { assignTest, createQuestion, fetchPersonalizedTest, fetchPersonalizedTestByRequest } from '../../services/dashboard'

type Question = {
  id: number
  prompt: string
  order: number
  options: Array<{ id: number; label: string; description: string; order: number }>
}

type PersonalizedTest = {
  id: number
  status: string
  request: {
    id: number
    student: { email: string }
    interests_snapshot: string
    qualification_snapshot: string
  }
  questions: Question[]
}

export default function QuestionBuilderPage() {
  const [searchParams] = useSearchParams()
  const testIdParam = searchParams.get('testId')
  const requestIdParam = searchParams.get('requestId')

  const [test, setTest] = useState<PersonalizedTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    order: 0,
    options: [{ label: '', description: '', order: 0 }],
  })
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    const loadTest = async () => {
      if (!testIdParam && !requestIdParam) {
        setError('No test ID provided.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        let data
        if (testIdParam) {
          data = await fetchPersonalizedTest(parseInt(testIdParam))
        } else if (requestIdParam) {
          data = await fetchPersonalizedTestByRequest(parseInt(requestIdParam))
        }
        if (data) {
          setTest(data)
          setNewQuestion((prev) => ({ ...prev, order: data.questions.length }))
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string; detail?: string } } }
        setError(error?.response?.data?.error || error?.response?.data?.detail || 'Unable to load test.')
      } finally {
        setLoading(false)
      }
    }
    loadTest()
  }, [testIdParam, requestIdParam])

  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { label: '', description: '', order: prev.options.length }],
    }))
  }

  const handleRemoveOption = (index: number) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index).map((opt, i) => ({ ...opt, order: i })),
    }))
  }

  const handleUpdateOption = (index: number, field: 'label' | 'description', value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)),
    }))
  }

  const handleSubmitQuestion = async () => {
    if (!test || !newQuestion.prompt.trim() || newQuestion.options.some((opt) => !opt.label.trim())) {
      setError('Please fill in question prompt and all option labels.')
      return
    }
    try {
      setAddingQuestion(true)
      const payload = {
        prompt: newQuestion.prompt,
        order: newQuestion.order,
        options: newQuestion.options.map((opt, i) => ({
          label: opt.label,
          description: opt.description,
          order: i,
        })),
      }
      await createQuestion(test.id, payload)
      const updatedTest = await fetchPersonalizedTest(test.id)
      setTest(updatedTest)
      setNewQuestion({
        prompt: '',
        order: updatedTest.questions.length,
        options: [{ label: '', description: '', order: 0 }],
      })
      setError(null)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error?.response?.data?.detail || 'Failed to create question.')
    } finally {
      setAddingQuestion(false)
    }
  }

  const handleAssignTest = async () => {
    if (!test) return
    if (test.questions.length === 0) {
      setError('Cannot assign test without questions.')
      return
    }
    try {
      setAssigning(true)
      await assignTest(test.id)
      const updatedTest = await fetchPersonalizedTest(test.id)
      setTest(updatedTest)
      setError(null)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string; detail?: string } } }
      setError(error?.response?.data?.error || error?.response?.data?.detail || 'Failed to assign test.')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
      </div>
    )
  }

  if (error && !test) {
    return (
      <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/10 p-6 text-center">
        <p className="text-red-200">{error}</p>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-slate-300">No test found. Create a test from the requests page first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Creation lab</p>
          <h3 className="font-display text-2xl text-white">MCQ builder</h3>
          <p className="mt-1 text-sm text-slate-300">
            For: {test.request.student.email} · Status: {test.status}
          </p>
        </div>
        {test.questions.length > 0 && test.status !== 'assigned' && (
          <button
            onClick={handleAssignTest}
            disabled={assigning}
            className="rounded-full border border-brand bg-brand/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand/30 disabled:opacity-50"
          >
            {assigning ? 'Assigning...' : 'Assign to student'}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {test.status === 'assigned' && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          Test has been assigned to the student.
        </div>
      )}

      <div className="space-y-4">
        {test.questions.map((question) => (
          <div key={question.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Question {question.order + 1}</p>
            <p className="mt-2 font-semibold text-xl text-white">{question.prompt}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {question.options.map((option) => (
                <li key={option.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                  <span className="font-medium">{option.label}</span>
                  {option.description && <p className="mt-1 text-xs text-slate-400">{option.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {test.status !== 'assigned' && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Add new question</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-white">Question prompt</label>
                <textarea
                  value={newQuestion.prompt}
                  onChange={(e) => setNewQuestion((prev) => ({ ...prev, prompt: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                  rows={3}
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Options</label>
                  <button
                    onClick={handleAddOption}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    + Add option
                  </button>
                </div>
                <div className="space-y-2">
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          placeholder={`Option ${index + 1} label`}
                        />
                        <input
                          type="text"
                          value={option.description}
                          onChange={(e) => handleUpdateOption(index, 'description', e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          placeholder="Optional description"
                        />
                      </div>
                      {newQuestion.options.length > 1 && (
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmitQuestion}
                disabled={addingQuestion}
                className="w-full rounded-2xl border border-brand bg-brand/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/30 disabled:opacity-50"
              >
                {addingQuestion ? 'Adding question...' : 'Add question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
