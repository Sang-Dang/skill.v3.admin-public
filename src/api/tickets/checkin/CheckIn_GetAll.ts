import { transformRes } from '@/api/utils'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import axios from 'axios'

type Response = TicketCheckInModel[]

export async function CheckIn_GetAll() {
    return axios.get<Response>('/ticket-order-checkin/get-all-checkin-records', {
        transformResponse: [(data) => transformRes(data, (res) => TicketCheckInModel.fromJSONList(res.data))],
    })
}
