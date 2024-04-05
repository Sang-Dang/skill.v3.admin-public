import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import { BaseModel, IBase } from '@/lib/model/base.model'
import { PaymentModel } from '@/lib/model/payment.model'
import { ITicketOrderItem, TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'

export interface ITicketOrder extends IBase {
    email: string
    phone: string
    username: string
    total: number
    ticketVoucher: string
    status: TicketOrderStatus
    payment: PaymentModel | null
    project: string
    items: ITicketOrderItem[]
}

export class TicketOrderModel extends BaseModel implements ITicketOrder {
    email: string
    phone: string
    username: string
    total: number
    ticketVoucher: string
    status: TicketOrderStatus
    payment: PaymentModel | null
    project: string
    items: ITicketOrderItem[]

    constructor(data: ITicketOrder) {
        super(data)
        this.email = data.email
        this.phone = data.phone
        this.username = data.username
        this.total = data.total
        this.ticketVoucher = data.ticketVoucher
        this.status = data.status
        this.payment = data.payment
        this.project = data.project
        this.items = data.items
    }

    static fromJSON(record: Record<string, any>): BaseModel {
        return new TicketOrderModel({
            ...super.fromJSON(record),
            email: record.email,
            phone: record.phone,
            username: record.username,
            total: record.total,
            ticketVoucher: record.ticketVoucher,
            status: record.status,
            payment: record.payment ? PaymentModel.fromJSON(record.payment) : null,
            project: record.project,
            items: TicketOrderItemModel.fromJSONList(record.items),
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketOrderModel[] {
        return records.map((record) => TicketOrderModel.fromJSON(record) as TicketOrderModel)
    }

    static serialize(model: Partial<TicketOrderModel>): { [key in keyof ITicketOrder]: any } {
        return {
            ...super.serialize(model),
            email: model.email,
            phone: model.phone,
            username: model.username,
            total: model.total,
            ticketVoucher: model.ticketVoucher,
            status: model.status,
            payment: model.payment ? PaymentModel.serialize(model.payment) : undefined,
            project: model.project,
            items: model.items?.map((item) => TicketOrderItemModel.serialize(item)),
        }
    }
}
