import { transformRes } from '@/api/utils'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Request = {
    projectId: string
}
type Response = TicketVoucherModel[]

export async function TicketVoucher_GetAllByProjectId({ projectId }: Request) {
    return axios.get<Response>('/ticket-voucher', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketVoucherModel.fromJSONList(res.data)),
            (data: TicketVoucherModel[]) => {
                return data.filter((voucher) => voucher.project === projectId)
            },
        ],
    })
}
