import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Frontend from "./pages/LandingPage"
import Dashboard from './pages/Dashboard/Dashboard'
import Login from "./pages/Authentication/Login"
import SignUp from "./pages/Authentication/Signup"
import ForgotPassword from './pages/Authentication/ForgotPassword'
import NoPage from "./pages/NoPage"
import PrivateRoute from './pages/Services/PrivateRoute'
import { AuthenticatedContext } from './context/AuthenticatedContext'
import DashboardLayout from './pages/Dashboard/DashboardLayout'

export default function CustomRoutes() {
  const { isAuthenticated } = useContext(AuthenticatedContext);

  return (
    <Routes>
      <Route path='/' element={<Frontend />} />
      <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/dashboard/*' element={<PrivateRoute Component={DashboardLayout} />} />
      <Route path='*' element={<NoPage />} />
    </Routes>
  )
}