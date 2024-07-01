import React, { createContext, useState } from 'react'

export interface AuthState {
  user?: string
  accessToken?: string
}

export interface AuthContextType {
  auth: AuthState
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({})

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
