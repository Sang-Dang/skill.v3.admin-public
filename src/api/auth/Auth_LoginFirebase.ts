import { transformRes } from "@/api/utils"
import axios from "axios"

export type Auth_LoginFirebase_Req = {
    authorization: string
}

export type Auth_LoginFirebase_Res = string

export async function Auth_LoginFirebase(req: Auth_LoginFirebase_Req) {
    return axios.post<Auth_LoginFirebase_Res>("/auth/login-firebase", req, {
        transformResponse: [
            (data) =>
                transformRes(data, undefined, (error) => {
                    throw new Error(error.message)
                }),
        ],
        validateStatus(status) {
            switch (status) {
                case 200:
                    return true
                case 500: // when bad token
                    return true
                default:
                    throw new Error("Look inside Auth_LoginFirebase")
            }
        },
    })
}
