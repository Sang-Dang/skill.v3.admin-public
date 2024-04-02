import { AuthContext } from '@/common/context/AuthContext'
import { useContext } from 'react'

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }
    return context.authHandler
}
