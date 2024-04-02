import { transformRes } from '@/api/utils'
import { AuthModel } from '@/lib/model/auth.model'
import axios from 'axios'

export type Accounts_Delete_Req = Pick<AuthModel, 'id'> & Token

export type Accounts_Delete_Res = boolean

export async function Accounts_Delete(req: Accounts_Delete_Req) {
    return axios.delete<Accounts_Delete_Res>(`/accounts/${req.id}`, {
        headers: {
            Authorization: `Bearer ${req.token}`,
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
