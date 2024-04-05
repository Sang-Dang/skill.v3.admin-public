import { transformRes } from '@/api/utils'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Response = TicketModel[]

export async function Tickets_GetAllDisabled() {
    return axios.get<Response>('/ticket', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketModel.fromJSONList(res.data)),
            (data: TicketModel[]) => data.filter((ticket) => ticket.deletedAt !== null),
        ],
    })
}
