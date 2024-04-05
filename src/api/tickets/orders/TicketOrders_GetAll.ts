import { transformRes } from '@/api/utils'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Response = TicketOrderModel[]

export async function TicketOrders_GetAll() {
    return axios.get<Response>('/ticket-order', {
        transformResponse: [(data) => transformRes(data, (res) => TicketOrderModel.fromJSONList(res.data))],
    })
}
