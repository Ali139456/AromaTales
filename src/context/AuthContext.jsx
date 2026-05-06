import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { apiPath } from '../services/api'

const AuthContext = createContext(null)

async function fetchProfile(accessToken) {
  const response = await fetch(apiPath('/auth/me'), {
    headers: { Authorization: 'Bearer ' + accessToken }
  })
  if (!response.ok) return null
  const data = await response.json()
  return data.profile || null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (sess) => {
    if (!sess?.access_token) {
      setProfile(null)
      return
    }
    try {
      const p = await fetchProfile(sess.access_token)
      setProfile(p)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s || null)
      refreshProfile(s).finally(() => setLoading(false))
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s || null)
      refreshProfile(s)
    })

    return () => subscription.unsubscribe()
  }, [refreshProfile])

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { error: new Error('Auth not configured') }
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signUp = useCallback(async (email, password, fullName) => {
    if (!supabase) return { error: new Error('Auth not configured') }
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: fullName || '' }
      }
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      accessToken: session?.access_token ?? null,
      signIn,
      signUp,
      signOut,
      refreshProfile: () => refreshProfile(session)
    }),
    [session, profile, loading, signIn, signUp, signOut, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
