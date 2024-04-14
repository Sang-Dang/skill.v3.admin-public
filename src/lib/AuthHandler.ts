import { Auth_VerifyTokenAdmin } from '@/api/auth/Auth_VerifyTokenAdmin'
import { auth } from '@/firebase'
import { getRoleNumber, Role } from '@/lib/enum/role.enum'
import { Token } from '@/lib/types/Token'
import { redirect } from '@tanstack/react-router'
import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export class AuthHandler {
    private memoryToken: string | null = null

    getToken(): string {
        let token = this.memoryToken

        if (!token) {
            token = this.getCookieToken()
        }

        if (!token) {
            throw redirect({
                to: '/',
                search: {
                    redirect: window.location.pathname,
                    error: 'Unauthorized Access',
                },
            })
        }

        return token
    }

    public login(serverToken: string) {
        devLog('Login Successful with token', serverToken)
        this.setCookieToken(serverToken)
    }

    public async logout() {
        devLog('Logout Successful')
        this.removeCookieToken()
        this.memoryToken = null
        AuthHandler.setRequestToken()
    }

    public async showGoogleLogin() {
        const provider = new GoogleAuthProvider().setCustomParameters({
            prompt: 'select_account',
        })
        return signInWithPopup(auth, provider) // no await, send error to caller
    }

    public isAuthorized(targetRole: Role, currentRole?: Role) {
        if (!currentRole) return false
        return getRoleNumber(targetRole) >= getRoleNumber(currentRole)
    }

    public getTokenPayload() {
        let token = this.memoryToken
        if (!this.memoryToken) {
            token = this.getCookieToken() ?? null
        }

        if (!token) {
            this.logout()
            throw redirect({
                to: '/',
            })
        }

        return this.decodeToken(token)
    }

    private getCookieToken(): string | null {
        return Cookies.get('token') ?? null
    }

    private setCookieToken(token: string) {
        Cookies.set('token', token)
    }

    private removeCookieToken() {
        Cookies.remove('token')
    }

    public async authorize(role: Role, logoutOnError: boolean = true) {
        if (this.clientVerifyToken(role)) {
            devLog('Client Verification Successful')
            return true
        } else {
            if (await this.serverVerifyToken(role)) {
                devLog('Server Verification Successful')
                return true
            } else {
                if (logoutOnError) {
                    this.logout()
                }
                return false
            }
        }
    }

    private clientVerifyToken(role: Role) {
        const cookieToken = this.getCookieToken()

        if (!cookieToken || !this.memoryToken || cookieToken !== this.memoryToken) {
            devLog('Client Verification Failed: Token Mismatch')
            return false
        }

        const tokenPayload = this.decodeToken(cookieToken)

        if (!this.isAuthorized(role, tokenPayload.role)) {
            devLog(`Client Verification Failed: ${tokenPayload.role} is not authorized to access ${role} content.`)
            return false
        }

        if (tokenPayload.exp * 1000 < new Date().getTime()) {
            devLog('Client Verification Failed: Token expired.')
            return false
        }

        AuthHandler.setRequestToken(this.memoryToken)

        return true
    }

    private async serverVerifyToken(role: Role) {
        const cookieToken = this.getCookieToken()

        if (!cookieToken) {
            devLog('Server Verification Failed: No token found')
            return false
        }

        let response

        switch (role) {
            case Role.ADMIN:
                response = (await Auth_VerifyTokenAdmin({ token: cookieToken })).data
                break
            default:
                response = false
        }

        if (response === true) {
            this.memoryToken = cookieToken
            AuthHandler.setRequestToken(this.memoryToken)
            return true
        } else {
            devLog('Server Verification Failed: Token is invalid or Role is not authorized.')
            return false
        }
    }

    private decodeToken(token: string) {
        return jwtDecode(token) as Token
    }

    private static setRequestToken(token?: string) {
        axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined
    }
}
