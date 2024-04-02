import { transformRes } from '@/api/utils'
import { AuthModel } from '@/lib/model/auth.model'
import axios from 'axios'

export type Accounts_GetAll_Res = AuthModel[]

export async function Accounts_GetAll() {
    return axios.get<Accounts_GetAll_Res>('/auth/admin/all-accounts', {
        transformResponse: [(data) => transformRes(data, (res) => AuthModel.fromJSONList(res.data))],
    })
}
