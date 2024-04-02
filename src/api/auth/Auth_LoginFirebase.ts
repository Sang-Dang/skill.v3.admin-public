import { transformRes } from '@/api/utils'
import axios from 'axios'

type Request = {
    firebase: string
}
type Response = string

export async function Auth_LoginFirebase(req: Request) {
    return axios.post<Response>('/auth/login-firebase', undefined, {
        headers: {
            Authorization: req.firebase,
        },
        transformResponse: [(data) => transformRes(data)],
        validateStatus(status) {
            switch (status) {
                case 200:
                    return true
                case 500: // when bad token
                    return true
                default:
                    return false
            }
        },
    })
}
