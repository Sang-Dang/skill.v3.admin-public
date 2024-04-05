import { CreateTicketOrderResponseModel } from '@/lib/model/createTicketOrderResponse.model'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = Pick<TicketOrderModel, 'email' | 'phone' | 'username' | 'total' | 'ticketVoucher' | 'items' | 'project'>
type Response = CreateTicketOrderResponseModel

export async function TicketOrders_Create(req: Request) {
    return axios.post<Response>('/ticket-order', req, {
        transformResponse: [(data) => CreateTicketOrderResponseModel.fromJSON(JSON.parse(data))],
    })
}
