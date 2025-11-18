import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import LandingPage from './pages/Landing'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ComingSoon from './pages/dashboard/ComingSoon'
import StudentDashboard from './pages/dashboard/StudentDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/requests"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <ComingSoon title="Test requests" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/recommendations"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <ComingSoon title="Recommendations" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
