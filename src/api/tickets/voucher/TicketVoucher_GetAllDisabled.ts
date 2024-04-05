import { transformRes } from '@/api/utils'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Response = TicketVoucherModel[]

export async function TicketVoucher_GetAllDisabled() {
    return axios.get<Response>('/ticket-voucher', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketVoucherModel.fromJSONList(res.data)),
            (data: Response) => data.filter((v) => v.deletedAt !== null),
        ],
    })
}
