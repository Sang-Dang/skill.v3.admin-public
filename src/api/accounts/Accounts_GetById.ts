import { transformRes } from '@/api/utils'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { AuthModel } from '@/lib/model/auth.model'
import axios from 'axios'

export type Accounts_GetAll_Req = Pick<AuthModel, 'id'>

export type Accounts_GetById_Res = AuthModel

export async function Accounts_GetById(req: Accounts_GetAll_Req) {
    return axios.get<Accounts_GetById_Res>('/auth/admin/all-accounts', {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => {
                        const accountDumbList = AuthModel.fromJSONList(res.data)

                        if (accountDumbList.length === 0) {
                            throw new ResourceNotFoundError('Account not found')
                        }

                        const account = accountDumbList.filter((account) => account.id === req.id)[0]

                        if (!account) {
                            throw new ResourceNotFoundError('Account not found')
                        }

                        return account
                    },
                    (error) => {
                        throw new ResourceNotFoundError(error.message)
                    },
                ),
        ],
        validateStatus: (status) => status === 200 || status === 500,
    })
}
