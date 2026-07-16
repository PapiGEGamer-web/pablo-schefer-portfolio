/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { authConfigured, getSupabase } from '../lib/supabase'

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

async function requireClient() {
  const client = await getSupabase()
  if (!client) throw new Error('auth_not_configured')
  return client
}

function cleanEmail(value: string) {
  const email = value.normalize('NFKC').trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) throw new Error('invalid_email')
  return email
}

function cleanUsername(value: string) {
  const username = value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}._ -]/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 32)
  if (username.length < 3) throw new Error('missing_username')
  return username
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(authConfigured)

  useEffect(() => {
    if (!authConfigured) return undefined
    let disposed = false
    let unsubscribe: (() => void) | undefined

    const timer = window.setTimeout(() => {
      void getSupabase().then(async (client) => {
        if (!client || disposed) return
        const { data } = await client.auth.getSession()
        if (disposed) return
        setSession(data.session)
        setLoading(false)
        const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession)
          setLoading(false)
        })
        unsubscribe = () => listener.subscription.unsubscribe()
      }).catch(() => {
        if (!disposed) setLoading(false)
      })
    }, 250)

    return () => {
      disposed = true
      window.clearTimeout(timer)
      unsubscribe?.()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    configured: authConfigured,
    loading,
    session,
    user: session?.user ?? null,
    sendRegistrationCode: async (email) => {
      const client = await requireClient()
      const { error } = await client.auth.signInWithOtp({
        email: cleanEmail(email),
        options: { shouldCreateUser: true },
      })
      if (error) throw error
    },
    completeRegistration: async (email, code, password, username) => {
      const client = await requireClient()
      if (!/^\d{8}$/.test(code)) throw new Error('invalid_token')
      if (password.length < 12) throw new Error('weak_password')
      const { error: verifyError } = await client.auth.verifyOtp({ email: cleanEmail(email), token: code, type: 'email' })
      if (verifyError) throw verifyError
      const normalizedUsername = cleanUsername(username)
      const { error: passwordError } = await client.auth.updateUser({
        password,
        data: {
          display_name: normalizedUsername,
          username: normalizedUsername,
        },
      })
      if (passwordError) throw passwordError
    },
    signIn: async (email, password) => {
      const client = await requireClient()
      const { error } = await client.auth.signInWithPassword({ email: cleanEmail(email), password })
      if (error) throw error
    },
    updateProfile: async (username) => {
      const normalizedUsername = cleanUsername(username)
      const client = await requireClient()
      const { error } = await client.auth.updateUser({
        data: {
          display_name: normalizedUsername,
          username: normalizedUsername,
        },
      })
      if (error) throw error
    },
    signOut: async () => {
      const client = await requireClient()
      const { error } = await client.auth.signOut()
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
