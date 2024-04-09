import { BaseModel, IBase } from '@/lib/model/base.model'

export interface ITicketCheckIn extends IBase {
    idOrder: string
    idItem: string
}

export class TicketCheckInModel extends BaseModel implements ITicketCheckIn {
    idOrder: string
    idItem: string

    constructor(data: ITicketCheckIn) {
        super(data)
        this.idOrder = data.idOrder
        this.idItem = data.idItem
    }

    static fromJSON(record: Record<string, any>): BaseModel {
        return new TicketCheckInModel({
            ...super.fromJSON(record),
            idOrder: record.idOrder,
            idItem: record.idItem,
        })
    }

    static fromJSONList(records: Record<string, any>[]): TicketCheckInModel[] {
        return records.map((record) => TicketCheckInModel.fromJSON(record) as TicketCheckInModel)
    }

    static serialize(model: Partial<TicketCheckInModel>): { [key in keyof ITicketCheckIn]: any } {
        return {
            ...super.serialize(model),
            idOrder: model.idOrder,
            idItem: model.idItem,
        }
    }
}
