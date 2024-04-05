import { transformRes } from '@/api/utils'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Request = Pick<TicketModel, 'ticketName' | 'description' | 'price' | 'quantity' | 'startDate' | 'endDate' | 'project' | 'images'>
type Response = TicketModel

export async function Tickets_Create(req: Request) {
    return axios.post<Response>('/ticket', {
        ...req,
        startDate: req.startDate.toISOString(),
        endDate: req.endDate.toISOString(),
    }, {
        transformResponse: [(data) => transformRes(data, (res) => TicketModel.fromJSON(res.data))],
    })
}
