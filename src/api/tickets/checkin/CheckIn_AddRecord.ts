import { transformRes } from '@/api/utils'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import axios from 'axios'

type Request = {
    idOrder: string
    idItem: string
}

type Response = TicketCheckInModel

export async function CheckIn_AddRecord(req: Request) {
    return axios.post<Response>('/ticket-order-checkin/add-checkin-record', req, {
        transformResponse: [(data) => transformRes(data, (res) => TicketCheckInModel.fromJSON(res))],
    })
}
