import { transformRes } from '@/api/utils'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Request = Pick<TicketVoucherModel, 'applyTicketId' | 'discount' | 'quantity' | 'note' | 'startDate' | 'endDate' | 'voucherCode'>
type Response = TicketVoucherModel

export async function TicketVoucher_Create(req: Request) {
    return axios.post<Response>(
        '/ticket-voucher',
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
