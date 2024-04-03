import { transformRes } from '@/api/utils'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Request = {
    ids: string[]
}
type Response = TicketModel[]

export async function Tickets_GetManyById(req: Request) {
    return axios.get<Response>('/ticket', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketModel.fromJSONList(res.data)),
            (data: TicketModel[]) => {
                const set = new Set(req.ids)
                return data.filter((d) => set.has(d.id))
            },
        ],
    })
}
