import { transformRes } from '@/api/utils'
import { BadRequestError } from '@/lib/errors/BadRequestError'
import { AuthModel } from '@/lib/model/auth.model'
import axios from 'axios'

export type Accounts_Create_Req = Pick<AuthModel, 'username' | 'email' | 'phone' | 'password' | 'role'>

export type Accounts_Create_Res = AuthModel

export async function Accounts_Create(req: Accounts_Create_Req) {
    return axios.post<Accounts_Create_Res>('/auth/admin/create-account', req, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => AuthModel.fromJSON(res.data),
                    (error) => {
                        if (error.statusCode === 400) {
                            throw new BadRequestError(error.message)
                        }
                    },
                ),
        ],
        validateStatus(status) {
            switch (status) {
                case 200:
                case 201:
                case 400:
                    return true
                default:
                    return false
            }
        },
    })
}
