import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/"

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

  const persist = (res: { user: any; token: string }) => {
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
      const res = await fetch(API + "auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: input.email,  // Django expects username
          password: input.password
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Login failed")
      }
      const data = await res.json()  // { access, refresh }
      persist({ user: { email: input.email }, token: data.access })
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (input: { name?: string; email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await fetch(API + "auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: input.name,
          email: input.email,
          password: input.password
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Signup failed")
      }

      // after signup, automatically log in
      const data = await res.json()
      // Optionally, call /auth/token/ to get JWT
      const loginRes = await fetch(API + "auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: input.name, password: input.password })
      })
      const loginData = await loginRes.json()
      persist({ user: { email: input.email, name: input.name }, token: loginData.access })
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
      const res = await fetch(API + "me/", {
        headers: { Authorization: "Bearer " + token }
      })
      if (!res.ok) return
      const me = await res.json()
      setUser(me)
      localStorage.setItem("auth_user", JSON.stringify(me))
    } catch {
      // ignore errors
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
    refreshProfile
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
