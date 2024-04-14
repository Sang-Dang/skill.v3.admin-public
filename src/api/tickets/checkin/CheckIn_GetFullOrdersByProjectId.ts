import { transformRes } from '@/api/utils'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import axios from 'axios'

type Request = {
    projectId: string
}

type Response = TicketOrderModel[]

type CheckInOrders = {
    [itemId: string]: number
}

export async function CheckIn_GetFullOrdersByProjectId(req: Request) {
    const allCheckInItems = await axios.post<CheckInOrders>('/ticket-order-checkin/get-all-checkin-records', undefined, {
        transformResponse: [
            (data) => transformRes(data, (res) => TicketCheckInModel.fromJSONList(res.data)),
            (data: TicketCheckInModel[]) => {
                return data.reduce(
                    (prev, curr) => ({
                        ...prev,
                        [curr.idItem]: (prev[curr.idItem] || 0) + 1,
                    }),
                    {} as CheckInOrders,
                )
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
                        if (allCheckInItems.data[item.id] !== undefined) {
                            item.checkedIn = allCheckInItems.data[item.id]
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
