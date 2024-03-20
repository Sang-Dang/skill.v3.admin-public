import { transformRes } from "@/api/utils"
import axios from "axios"

export type Auth_Login_Req = {
    email: string
    password: string
}

export type Auth_Login_Res = string // the jwt token

export async function Auth_Login(req: Auth_Login_Req) {
    return axios.post<Auth_Login_Res>("/auth/login", req, {
        transformResponse: [(data) => transformRes(data)],
    })
}
