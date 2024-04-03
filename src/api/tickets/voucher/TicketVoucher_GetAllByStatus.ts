import { transformRes } from '@/api/utils'
import { TicketVoucherStatus } from '@/lib/enum/ticket-status.enum'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Request = {
    status: TicketVoucherStatus
}
type Response = TicketVoucherModel[]

export async function TicketVoucher_GetAllByStatus(req: Request) {
    return axios.get<Response>('/ticket-voucher', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketVoucherModel.fromJSONList(res.data)),
            (data: TicketVoucherModel[]) => {
                return data.filter((voucher: TicketVoucherModel) => {
                    const now = new Date()
                    switch (req.status) {
                        case TicketVoucherStatus.RUNNING:
                            return voucher.startDate.isBefore(now) && voucher.endDate.isAfter(now)
                        case TicketVoucherStatus.ARCHIVED:
                            return voucher.startDate.isBefore(now) && voucher.endDate.isBefore(now)
                        case TicketVoucherStatus.FUTURE:
                            return voucher.startDate.isAfter(now) && voucher.endDate.isAfter(now)
                        default:
                            return true
                    }
                })
            },
        ],
    })
}
