import { transformRes } from '@/api/utils'
import { AuthModel } from '@/lib/model/auth.model'
import { authHandler } from '@/router'
import axios from 'axios'

export type Accounts_Update_Req = {
    id: string
    payload: Pick<AuthModel, 'username' | 'password' | 'phone' | 'role'>
}

export type Accounts_Update_Res = boolean

export async function Accounts_Update(req: Accounts_Update_Req) {
    return axios.put<Accounts_Update_Res>(`/auth/admin/update-account/${encodeURIComponent(req.id)}`, req.payload, {
        headers: {
            Authorization: `Bearer ${authHandler.getToken()}`,
        },
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res: SuccessResponse<UpdateResponse>) => res.data.affected > 0,
                    () => false,
                ),
        ],
    })
}
