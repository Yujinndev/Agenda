import useAuth from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = () => {
  const { auth } = useAuth()
  const location = useLocation()

  if (!auth?.accessToken) {
    return (
      <Navigate to="/onboarding/signin" state={{ from: location }} replace />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
