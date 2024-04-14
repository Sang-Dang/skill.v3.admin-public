import { transformRes } from '@/api/utils'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    projectId: string
}
type Response = TicketOrderModel[]

export async function TicketOrders_GetAllByProjectId(req: Request) {
    return axios.get<Response>('/ticket-order', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketOrderModel.fromJSONList(res.data)),
            (data) => data.filter((order: TicketOrderModel) => order.project === req.projectId),
        ],
    })
}