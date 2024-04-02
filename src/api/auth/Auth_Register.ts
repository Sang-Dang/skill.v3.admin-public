import { AuthModel } from "@/lib/model/auth.model"
import axios from "axios"
import { transformRes } from "@/api/utils"

type Request = {
    username: string
    email: string
    phone: string
    password: string
}
type Response = AuthModel

export async function Auth_Register(req: Request) {
    return axios.post<Response>('/auth/register', req, {
        transformResponse: [(data) => transformRes(data, (res) => AuthModel.fromJSON(res.data))],
    })
}
