import { transformRes } from '@/api/utils'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import axios from 'axios'

type Request = {
    id: string
}
type Response = TicketVoucherModel

export async function TicketVoucher_GetById(request: Request) {
    return axios.get<Response>(`/ticket-voucher/${encodeURIComponent(request.id)}`, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => {
                        const ticketDumbList = TicketVoucherModel.fromJSONList(res.data)

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
