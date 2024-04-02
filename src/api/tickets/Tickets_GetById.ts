import { transformRes } from '@/api/utils'
import { NotFoundError } from '@/lib/errors/NotFoundError'
import { TicketModel } from '@/lib/model/ticket.model'
import axios from 'axios'

type Request = { id: string }
type Response = TicketModel

export async function Tickets_GetById(req: Request) {
    return axios.get<Response>(`/ticket/${req.id}`, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => {
                        const ticketDumbList = TicketModel.fromJSONList(res.data)

                        if (ticketDumbList.length === 0) {
                            throw new NotFoundError('Ticket not found')
                        }

                        return ticketDumbList[0]
                    },
                    (error) => {
                        throw new NotFoundError(error.message)
                    },
                ),
        ],

        validateStatus: (status) => status === 200 || status === 500,
    })
}
