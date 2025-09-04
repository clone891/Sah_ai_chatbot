import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authApi, AuthResult } from "@/lib/api"

export type AuthState = {
  user: any | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (input: { email: string; password: string }) => Promise<void>
  signup: (input: { name?: string; email: string; password: string }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"))
  const [user, setUser] = useState<any | null>(() => {
    const v = localStorage.getItem("auth_user")
    try { return v ? JSON.parse(v) : null } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const persist = (res: AuthResult) => {
    setToken(res.token)
    localStorage.setItem("auth_token", res.token)
    if (res.user !== undefined) {
      setUser(res.user)
      localStorage.setItem("auth_user", JSON.stringify(res.user))
    }
  }

  const login = useCallback(async (input: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await authApi.login(input)
      persist(res)
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (input: { name?: string; email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await authApi.signup(input)
      persist(res)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!token) return
    try {
      const me = await authApi.me()
      if (me) {
        setUser(me)
        localStorage.setItem("auth_user", JSON.stringify(me))
      }
    } catch {
      // ignore profile errors
    }
  }, [token])

  useEffect(() => {
    if (token && !user) {
      refreshProfile()
    }
  }, [token, user, refreshProfile])

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    signup,
    logout,
    refreshProfile,
  }), [user, token, loading, login, signup, logout, refreshProfile])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
