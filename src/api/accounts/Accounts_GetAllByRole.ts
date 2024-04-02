import { Role } from '@/lib/enum/role.enum'
import { AuthModel } from '@/lib/model/auth.model'
import axios from 'axios'

export type Accounts_GetAllByRole_Req = {
    role: Role
}
export type Accounts_GetAllByRole_Res = AuthModel[]

export async function Accounts_GetAllByRole(req: Accounts_GetAllByRole_Req) {
    return axios.get<Accounts_GetAllByRole_Res>('auth/admin/all-accounts', {
        transformResponse: [
            (data) => JSON.parse(data).data.map((res: any) => AuthModel.fromJSON(res)),
            (res) => {
                return res.filter((account: any) => account.role === req.role)
            },
        ],
    })
}
