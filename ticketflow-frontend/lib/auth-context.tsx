'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from './api'
import { jwtDecode } from 'jwt-decode' // Import jwtDecode

export interface User {
  id: number
  email: string
  full_name: string
  is_staff: boolean
  is_active: boolean
  role: string // Added role field
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token)
          if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("Token expired");
            localStorage.removeItem('authToken')
            setUser(null)
          } else {
            // Try to get full user data from /me
            try {
              const res = await api.auth.me()
              if (res.data) {
                setUser(res.data)
              } else if (res.status === 401) {
                console.warn("Token rejected by server");
                localStorage.removeItem('authToken')
                setUser(null)
              } else {
                console.warn("Profile fetch failed, using token data");
                setUser({
                  id: decodedToken.user_id,
                  email: decodedToken.email,
                  full_name: decodedToken.full_name,
                  is_staff: decodedToken.is_staff,
                  is_active: decodedToken.is_active,
                  role: decodedToken.role,
                })
              }
            } catch (fetchErr) {
              console.error("Profile fetch error:", fetchErr);
              setUser({
                id: decodedToken.user_id,
                email: decodedToken.email,
                full_name: decodedToken.full_name,
                is_staff: decodedToken.is_staff,
                is_active: decodedToken.is_active,
                role: decodedToken.role,
              })
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error)
          localStorage.removeItem('authToken')
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password)
    
    if (response.error) {
      console.error("Login response error:", response.error);
      const errorMsg = typeof response.error === 'string' 
        ? response.error 
        : (response.error.detail || response.error.message || 'Login failed');
      throw new Error(errorMsg)
    }

    if (response.data && response.data.access) {
      localStorage.setItem('authToken', response.data.access)
      
      try {
        const res = await api.auth.me()
        if (res.data) {
          setUser(res.data)
        } else {
          console.warn("Could not fetch user profile, falling back to token data");
          const decodedToken: any = jwtDecode(response.data.access)
          setUser({
            id: decodedToken.user_id,
            email: decodedToken.email,
            full_name: decodedToken.full_name,
            is_staff: decodedToken.is_staff,
            is_active: decodedToken.is_active,
            role: decodedToken.role,
          })
        }
      } catch (err) {
        console.error("Error during profile fetch or token decode:", err);
        const decodedToken: any = jwtDecode(response.data.access)
        setUser({
          id: decodedToken.user_id,
          email: decodedToken.email,
          full_name: decodedToken.full_name,
          is_staff: decodedToken.is_staff,
          is_active: decodedToken.is_active,
          role: decodedToken.role,
        })
      }
    } else {
      throw new Error('Invalid response from server')
    }
  }

  const register = async (email: string, password: string, fullName: string) => {
    const response = await api.auth.register(email, password, fullName)
    if (response.error) {
      throw new Error(response.error.detail || 'Registration failed')
    }
    if (response.data) {
      setUser(response.data.user)
    }
  }

  const logout = async () => {
    await api.auth.logout()
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      const decodedToken: any = jwtDecode(token)
      const userFromToken: User = {
        id: decodedToken.user_id,
        email: decodedToken.email,
        full_name: decodedToken.full_name,
        is_staff: decodedToken.is_staff,
        is_active: decodedToken.is_active,
        role: decodedToken.role,
      }
      setUser(userFromToken)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
