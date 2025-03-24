import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthenticatedContext } from '@/context/AuthenticatedContext'

export default function PrivateRoute({ Component }) {
  const { isAuthenticated } = useContext(AuthenticatedContext)
  
  return isAuthenticated ? <Component /> : <Navigate to="/login" />
} 