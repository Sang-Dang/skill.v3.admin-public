import { transformRes } from '@/api/utils'
import axios from 'axios'

type Request = {
    token: string
}
type Response = boolean

export async function Auth_VerifyTokenAdmin({ token }: Request) {
    return axios.post<Response>('/auth/verify-admin-token', undefined, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        transformResponse: [(data) => transformRes(data, undefined, () => false)],
        validateStatus(status) {
            switch (status) {
                case 200:
                    return true
                case 500:
                    return true
                default:
                    return false
            }
        },
    })
}
