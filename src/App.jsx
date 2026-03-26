import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'

// Auth
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Public
import PublicDashboard from './pages/public/PublicDashboard'
import SubmitComplaint from './pages/public/SubmitComplaint'
import MyComplaints from './pages/public/MyComplaints'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AllComplaints from './pages/admin/AllComplaints'
import AssignComplaints from './pages/admin/AssignComplaints'

// Officer
import OfficerDashboard from './pages/officer/OfficerDashboard'
import AssignedComplaints from './pages/officer/AssignedComplaints'

// Higher Authority
import AuthorityDashboard from './pages/authority/AuthorityDashboard'
import EscalatedComplaints from './pages/authority/EscalatedComplaints'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function DashboardRouter() {
  const { user } = useAuth()
  if (!user) return null
  switch (user.role) {
    case 'Public': return <PublicDashboard />
    case 'Admin': return <AdminDashboard />
    case 'Officer': return <OfficerDashboard />
    case 'Higher Authority': return <AuthorityDashboard />
    default: return <PublicDashboard />
  }
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return null

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* Public */}
              <Route path="/submit" element={<SubmitComplaint />} />
              <Route path="/my-complaints" element={<MyComplaints />} />

              {/* Admin */}
              <Route path="/all-complaints" element={<AllComplaints />} />
              <Route path="/assign" element={<AssignComplaints />} />

              {/* Officer */}
              <Route path="/assigned" element={<AssignedComplaints />} />

              {/* Higher Authority */}
              <Route path="/escalated" element={<EscalatedComplaints />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
