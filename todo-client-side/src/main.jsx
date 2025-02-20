import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './route/Route.jsx'
import AuthProviders from './providers/AuthProviders.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProviders>
  <RouterProvider router={router}>
 </RouterProvider>
  </AuthProviders>
  </StrictMode>,
)
