import { transformRes } from '@/api/utils'
import { AlreadyCheckedInError } from '@/lib/errors/AlreadyCheckedInError'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import axios from 'axios'

type Request = {
    idOrder: string
    idItem: string
}

type Response = TicketCheckInModel

export async function CheckIn_AddRecord(req: Request) {
    return axios.post<Response>('/ticket-order-checkin/add-checkin-record', req, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => {
                        return TicketCheckInModel.fromJSON(res.data)
                    },
                    (error) => {
                        if (error.statusCode === 400 && error.message === 'Record is existed') {
                            throw new AlreadyCheckedInError()
                        }

                        throw error
                    },
                ),
        ],
    })
}
