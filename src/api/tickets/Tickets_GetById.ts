import { transformRes } from '@/api/utils'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
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
                            throw new ResourceNotFoundError('Ticket not found')
                        }

                        return ticketDumbList[0]
                    },
                    (error) => {
                        throw new ResourceNotFoundError(error.message)
                    },
                ),
        ],

        validateStatus: (status) => status === 200 || status === 500,
    })
}
