import { transformRes } from '@/api/utils'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import axios from 'axios'

type Request = {
    idOrder: string
}

type Response = TicketCheckInModel[]

export async function CheckIn_GetByOrderId(req: Request) {
    return axios.get<Response>('/ticket-order-checkin/get-checkin-records', {
        params: req,
        transformResponse: [(data) => transformRes(data, (res) => TicketCheckInModel.fromJSONList(res.data))],
    })
}
