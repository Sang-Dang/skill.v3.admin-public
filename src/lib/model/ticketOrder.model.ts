import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import { BaseModel, IBase } from '@/lib/model/base.model'
import { PaymentModel } from '@/lib/model/payment.model'
import { ITicketOrderItem, TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'
import { ITicketVoucher } from '@/lib/model/ticketVoucher.model'

export interface ITicketOrder extends IBase {
    email: string
    phone: string
    username: string
    total: number
    ticketVoucher: TicketVoucherMini
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
    ticketVoucher: TicketVoucherMini
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
            ticketVoucher: TicketVoucherMini.fromJSON(record.ticketVoucher),
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
            ticketVoucher: TicketVoucherMini.serialize(model.ticketVoucher ?? {}),
            status: model.status,
            payment: model.payment ? PaymentModel.serialize(model.payment) : undefined,
            project: model.project,
            items: model.items?.map((item) => TicketOrderItemModel.serialize(item)),
        }
    }
}

export class TicketVoucherMini implements Pick<ITicketVoucher, 'project' | 'quantity' | 'voucherCode' | 'note' | 'id'> {
    project: string
    quantity: number
    voucherCode: string
    note: string | null
    id: string

    constructor(data: Pick<ITicketVoucher, 'project' | 'quantity' | 'voucherCode' | 'note' | 'id'>) {
        this.project = data.project
        this.quantity = data.quantity
        this.voucherCode = data.voucherCode
        this.note = data.note
        this.id = data.id
    }

    static fromJSON(record: Record<string, any>): TicketVoucherMini {
        return new TicketVoucherMini({
            project: record.project,
            quantity: record.quantity,
            voucherCode: record.voucherCode,
            note: record.note,
            id: record.id,
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketVoucherMini[] {
        return records.map((record) => TicketVoucherMini.fromJSON(record))
    }

    static serialize(model: Partial<TicketVoucherMini>): { [key in keyof TicketVoucherMini]: any } {
        return {
            project: model.project,
            quantity: model.quantity,
            voucherCode: model.voucherCode,
            note: model.note,
            id: model.id,
        }
    }
}