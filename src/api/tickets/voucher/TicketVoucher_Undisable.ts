import { transformRes } from '@/api/utils'
import axios from 'axios'

type Request = {
    id: string
}
type Response = boolean

export async function TicketVoucher_Undisable(req: Request) {
    return axios.put<Response>(`/ticket-voucher/undelete/${req.id}`, undefined, {
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
