import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: 'student' | 'admin' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2FF]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
