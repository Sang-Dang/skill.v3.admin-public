import { transformRes } from '@/api/utils'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    email: string
}
type Response = TicketOrderModel[]

export async function TicketOrders_GetAllByEmail(req: Request) {
    return axios.get<Response>('/ticket-order', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketOrderModel.fromJSONList(res.data)),
            (data) => data.filter((order: TicketOrderModel) => order.email === req.email),
        ],
    })
}
