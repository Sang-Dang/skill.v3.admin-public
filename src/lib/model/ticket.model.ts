import { BaseModel, IBase } from '@/lib/model/base.model'
import dayjs, { Dayjs } from 'dayjs'

export interface ITicket extends IBase {
    ticketName: string
    description: string
    price: number
    quantity: number
    startDate: Dayjs
    endDate: Dayjs
    project: string
}

export class TicketModel extends BaseModel implements ITicket {
    ticketName: string
    description: string
    price: number
    quantity: number
    startDate: Dayjs
    endDate: Dayjs
    project: string

    constructor(data: ITicket) {
        super(data)
        this.ticketName = data.ticketName
        this.description = data.description
        this.price = data.price
        this.quantity = data.quantity
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.project = data.project
    }

    static fromJSON(record: Record<string, any>): BaseModel {
        return new TicketModel({
            ...super.fromJSON(record),
            ticketName: record.ticketName,
            description: record.description,
            price: record.price,
            quantity: record.quantity,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
            project: record.project,
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketModel[] {
        return records.map((record) => TicketModel.fromJSON(record) as TicketModel)
    }

    static serialize(model: Partial<TicketModel>): { [key in keyof ITicket]: any } {
        return {
            ...super.serialize(model),
            ticketName: model.ticketName,
            description: model.description,
            price: model.price?.toString(),
            quantity: model.quantity?.toString(),
            startDate: model.startDate?.toISOString(),
            endDate: model.endDate?.toISOString(),
            project: model.project,
        }
    }
}
