import { transformRes } from '@/api/utils'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Request = Pick<TicketVoucherModel, 'voucherCode' | 'discount' | 'quantity' | 'startDate' | 'endDate' | 'note' | 'project' | 'id'>
type Response = TicketVoucherModel

export async function TicketVoucher_Update(req: Request) {
    return axios.put<Response>(
        `/ticket-voucher/${encodeURIComponent(req.id)}`,
        {
            ...req,
            startDate: req.startDate.toISOString(),
            endDate: req.endDate.toISOString(),
        },
        {
            transformResponse: [(data) => transformRes(data, (res) => TicketVoucherModel.fromJSON(res.data))],
        },
    )
}
