import { AuthHandler } from '@/lib/AuthHandler'
import { createContext, ReactNode } from 'react'

type AuthContextType = {
    authHandler: AuthHandler
}
export const AuthContext = createContext<null | AuthContextType>(null)

export function AuthContextProvider({ children, authHandler }: { children: ReactNode; authHandler: AuthHandler }) {
    return <AuthContext.Provider value={{ authHandler }}>{children}</AuthContext.Provider>
}
