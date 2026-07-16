import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion } from 'motion/react'
import './fonts.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { LanyardProvider } from './hooks/useLanyardPresence'
import './styles.css'

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadMotionFeatures} strict>
      <BrowserRouter>
        <AuthProvider><LanyardProvider><App /></LanyardProvider></AuthProvider>
      </BrowserRouter>
    </LazyMotion>
  </StrictMode>,
)
