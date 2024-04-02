import { transformRes } from '@/api/utils'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Request = {
    projectId: string
}
type Response = TicketModel[]

export async function Tickets_GetAllByProjectId(req: Request) {
    return axios.get<Response>('/ticket', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketModel.fromJSONList(res.data)),
            (res) => {
                return res.filter((ticket: TicketModel) => ticket.project === req.projectId)
            },
        ],
    })
}
