import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import LEDashboard from './pages/law-enforcement/Dashboard.jsx'
import LETools from './pages/law-enforcement/Tools.jsx'
import LECases from './pages/law-enforcement/Cases.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminSettings from './pages/admin/Settings.jsx'
import AdminTickets from './pages/admin/Tickets.jsx'
import AdminAnalytics from './pages/admin/Analytics.jsx'
import AdminPlans from './pages/admin/Plans.jsx'
import AdminProviders from './pages/admin/Providers.jsx'
import AdminTools from './pages/admin/Tools.jsx'
import AdminContent from './pages/admin/Content.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Law Enforcement */}
      <Route path="/law-enforcement/dashboard" element={
        <ProtectedRoute allowedRoles={['law-enforcement']}>
          <LEDashboard />
        </ProtectedRoute>
      } />
      <Route path="/law-enforcement/tools" element={
        <ProtectedRoute allowedRoles={['law-enforcement']}>
          <LETools />
        </ProtectedRoute>
      } />
      <Route path="/law-enforcement/cases" element={
        <ProtectedRoute allowedRoles={['law-enforcement']}>
          <LECases />
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSettings />
        </ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminTickets />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/plans" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminPlans />
        </ProtectedRoute>
      } />
      <Route path="/admin/providers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProviders />
        </ProtectedRoute>
      } />
      <Route path="/admin/tools" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminTools />
        </ProtectedRoute>
      } />
      <Route path="/admin/content" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminContent />
        </ProtectedRoute>
      } />
      <Route path="/admin/registrations" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}