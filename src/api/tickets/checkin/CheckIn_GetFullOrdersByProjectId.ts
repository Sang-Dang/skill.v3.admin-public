import { transformRes } from '@/api/utils'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    projectId: string
}

type Response = TicketOrderModel[]

export async function CheckIn_GetFullOrdersByOrderId(req: Request) {
    const allCheckInItems = await axios.post<Set<string>>('/ticket-order-checkin/get-all-checkin-records', undefined, {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketCheckInModel.fromJSONList(res.data)),
            (data: TicketCheckInModel[]) => {
                return new Set(data.map((checkIn) => checkIn.idItem))
            },
        ],
    })

    const response = await axios.get<Response>('/ticket-order', {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketOrderModel.fromJSONList(res.data)),
            (data: Response) => data.filter((order) => order.project === req.projectId),
            (data: Response) => {
                return data.map((order) => {
                    order.items = order.items.map((item) => {
                        if (allCheckInItems.data.has(item.id)) {
                            item.checkedIn += 1
                        }

                        return item
                    })

                    return order
                })
            },
        ],
    })

    return response
}
