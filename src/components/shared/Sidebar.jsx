import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('cr_token')
  const user = localStorage.getItem('cr_user')
    ? JSON.parse(localStorage.getItem('cr_user'))
    : null

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}