import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import AuthenticatedContextProvider from './context/AuthenticatedContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthenticatedContextProvider>
        <App />
      </AuthenticatedContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
