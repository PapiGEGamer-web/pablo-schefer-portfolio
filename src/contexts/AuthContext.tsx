/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { authConfigured, supabase } from '../lib/supabase'

type AuthContextValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  sendRegistrationCode: (email: string) => Promise<void>
  completeRegistration: (email: string, code: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  updateProfile: (username: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function requireClient() {
  if (!supabase) throw new Error('auth_not_configured')
  return supabase
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(authConfigured)

  useEffect(() => {
    if (!supabase) return undefined
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    configured: authConfigured,
    loading,
    session,
    user: session?.user ?? null,
    sendRegistrationCode: async (email) => {
      const { error } = await requireClient().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
    },
    completeRegistration: async (email, code, password, username) => {
      const client = requireClient()
      const { error: verifyError } = await client.auth.verifyOtp({ email, token: code, type: 'email' })
      if (verifyError) throw verifyError
      const cleanUsername = username.normalize('NFKC').trim().slice(0, 32)
      const { error: passwordError } = await client.auth.updateUser({
        password,
        data: {
          display_name: cleanUsername,
          username: cleanUsername,
        },
      })
      if (passwordError) throw passwordError
    },
    signIn: async (email, password) => {
      const { error } = await requireClient().auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    updateProfile: async (username) => {
      const cleanUsername = username.normalize('NFKC').trim().slice(0, 32)
      if (!cleanUsername) throw new Error('missing_username')
      const { error } = await requireClient().auth.updateUser({
        data: {
          display_name: cleanUsername,
          username: cleanUsername,
        },
      })
      if (error) throw error
    },
    signOut: async () => {
      const { error } = await requireClient().auth.signOut()
      if (error) throw error
    },
  }), [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
