import { BaseModel, IBase } from '@/lib/model/base.model'
import dayjs, { Dayjs } from 'dayjs'

export interface ITicketVoucher extends IBase {
    voucherCode: string
    discount: number
    quantity: number
    startDate: Dayjs
    endDate: Dayjs
    applyTicketId: string[]
    note: string | null
    project: string
}

export class TicketVoucherModel extends BaseModel implements ITicketVoucher {
    voucherCode: string
    discount: number
    quantity: number
    startDate: Dayjs
    endDate: Dayjs
    applyTicketId: string[]
    note: string | null
    project: string

    constructor(data: ITicketVoucher) {
        super(data)
        this.voucherCode = data.voucherCode
        this.discount = data.discount
        this.quantity = data.quantity
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.applyTicketId = data.applyTicketId
        this.note = data.note
        this.project = data.project
    }

    static fromJSON(record: Record<string, any>): TicketVoucherModel {
        return new TicketVoucherModel({
            ...super.fromJSON(record),
            voucherCode: record.voucherCode,
            discount: record.discount,
            quantity: record.quantity,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
            applyTicketId: record.applyTicketId,
            note: record.note,
            project: record.project,
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketVoucherModel[] {
        return records.map((record) => TicketVoucherModel.fromJSON(record))
    }

    static serialize(model: Partial<ITicketVoucher>): { [key in keyof ITicketVoucher]: any } {
        return {
            id: model.id,
            key: model.id,
            createdAt: model.createdAt?.toISOString(),
            updatedAt: model.updatedAt?.toISOString(),
            deletedAt: model.deletedAt?.toISOString() ?? '',
            voucherCode: model.voucherCode,
            discount: model.discount,
            quantity: model.quantity,
            startDate: model.startDate?.toISOString(),
            endDate: model.endDate?.toISOString(),
            applyTicketId: model.applyTicketId,
            note: model.note,
            project: model.project,
        }
    }
}
