import { transformRes } from '@/api/utils'
import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    status: TicketOrderStatus
}
type Response = TicketOrderModel[]

export async function TicketOrders_GetAllByStatus(req: Request) {
    return axios.get<Response>('/ticket-order', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketOrderModel.fromJSONList(res.data)),
            (data) => data.filter((order: TicketOrderModel) => order.status === req.status),
        ],
    })
}
