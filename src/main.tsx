import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope/index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { LanyardProvider } from './hooks/useLanyardPresence'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider><LanyardProvider><App /></LanyardProvider></AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
