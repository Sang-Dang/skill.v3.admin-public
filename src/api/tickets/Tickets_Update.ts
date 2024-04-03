import { transformRes } from '@/api/utils'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Request = Pick<TicketModel, 'ticketName' | 'description' | 'startDate' | 'endDate' | 'price' | 'id'>
type Response = TicketModel

export async function Tickets_Update(req: Request) {
    return axios.put<Response>(
        `/ticket/${encodeURIComponent(req.id)}`,
        {
            ...req,
            startDate: req.startDate.toISOString(),
            endDate: req.endDate.toISOString(),
        },
        {
            transformResponse: [(data) => transformRes(data, (res) => TicketModel.fromJSON(res.data))],
        },
    )
}
