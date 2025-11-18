import { api } from '../lib/api'

type TestRequestPayload = {
  interests_snapshot: string
  qualification_snapshot: string
}

export const fetchStudentDashboard = async () => {
  const response = await api.get('student/dashboard/')
  return response.data
}

export const fetchStudentRequests = async () => {
  const response = await api.get('student/test-requests/')
  return response.data
}

export const createStudentTestRequest = async (payload: TestRequestPayload) => {
  const response = await api.post('student/test-requests/', payload)
  return response.data
}

export const fetchAdminTestRequests = async (status?: string) => {
  const response = await api.get('admin/test-requests/', { params: status ? { status } : undefined })
  return response.data
}

export const createPersonalizedTest = async (requestId: number) => {
  const response = await api.post(`admin/test-requests/${requestId}/create-test/`)
  return response.data
}

export const fetchPersonalizedTest = async (testId: number) => {
  const response = await api.get(`admin/tests/${testId}/`)
  return response.data
}

export const fetchPersonalizedTestByRequest = async (requestId: number) => {
  const response = await api.get(`admin/test-requests/${requestId}/test/`)
  return response.data
}

export const createQuestion = async (testId: number, payload: { prompt: string; order: number; options: Array<{ label: string; description: string; order: number }> }) => {
  const response = await api.post(`admin/tests/${testId}/questions/`, payload)
  return response.data
}

export const assignTest = async (testId: number) => {
  const response = await api.post(`admin/tests/${testId}/assign/`)
  return response.data
}
