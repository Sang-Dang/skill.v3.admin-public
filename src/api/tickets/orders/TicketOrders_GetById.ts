import { transformRes } from '@/api/utils'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    id: string
}
type Response = TicketOrderModel

export async function TicketOrders_GetById(req: Request) {
    return axios.get<Response>(`/ticket-order/${req.id}`, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => TicketOrderModel.fromJSON(res.data),
                    (error) => {
                        if (error.statusCode === 404) {
                            throw new ResourceNotFoundError('TicketOrder not found')
                        }
                        throw error
                    },
                ),
        ],
        validateStatus: (status) => {
            switch (status) {
                case 200:
                case 404:
                    return true
                default:
                    return false
            }
        },
    })
}
