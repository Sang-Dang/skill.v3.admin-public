import { BaseModel, IBase } from '@/lib/model/base.model'
import { ITicket } from '@/lib/model/ticket.model'

export interface ITicketOrderItem extends IBase {
    name: string
    ticket: Pick<ITicket, 'id'>
    price: number
    quantity: number
}

export class TicketOrderItemModel extends BaseModel implements ITicketOrderItem {
    name: string
    ticket: Pick<ITicket, 'id'>
    price: number
    quantity: number

    constructor(data: ITicketOrderItem) {
        super(data)
        this.name = data.name
        this.ticket = data.ticket
        this.price = data.price
        this.quantity = data.quantity
    }

    static fromJSON(record: Record<string, any>): BaseModel {
        return new TicketOrderItemModel({
            ...super.fromJSON(record),
            name: record.name,
            ticket: { id: record?.ticket?.id }, // TODO remove
            price: Number(record.price),
            quantity: Number(record.quantity),
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketOrderItemModel[] {
        return records.map((record) => TicketOrderItemModel.fromJSON(record) as TicketOrderItemModel)
    }

    static serialize(model: Partial<TicketOrderItemModel>): { [key in keyof ITicketOrderItem]: any } {
        return {
            ...super.serialize(model),
            name: model.name,
            ticket: model.ticket?.id,
            price: model.price,
            quantity: model.quantity,
        }
    }
}
