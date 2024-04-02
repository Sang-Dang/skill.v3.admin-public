import { transformRes } from "@/api/utils"
import axios from "axios"

type Request = {
    email: string
    password: string
}
type Response = string // the jwt token

export async function Auth_Login(req: Request) {
    return axios.post<Response>('/auth/login', req, {
        transformResponse: [(data) => transformRes(data)],
    })
}
