import { AuthModel } from "@/lib/model/auth.model"
import axios from "axios"
import { transformRes } from "@/api/utils"

export type Auth_Register_Req = {
    username: string
    email: string
    phone: string
    password: string
}

export type Auth_Register_Res = AuthModel

export async function Auth_Register(req: Auth_Register_Req) {
    return axios.post<Auth_Register_Res>("/auth/register", req, {
        transformResponse: [
            (data) => transformRes(data, (res) => AuthModel.fromJSON(res.data)),
        ],
    })
}
