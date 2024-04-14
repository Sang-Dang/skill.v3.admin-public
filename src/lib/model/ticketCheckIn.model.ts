import { BaseModel, IBase } from '@/lib/model/base.model'

export interface ITicketCheckIn extends IBase {
    idOrder: string
    idItem: string
}

export interface ITicketCheckInParsed {
    [orderId: string]: {
        [itemId: string]: number
    }
}

export interface ITicketCheckInFlat {
    [itemId: string]: number
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

    static parse(model: TicketCheckInModel[]) {
        return model.reduce(
            (prev, curr) => ({
                ...prev,
                [curr.idOrder]: {
                    ...prev[curr.idOrder],
                    [curr.idItem]: (prev[curr.idOrder]?.[curr.idItem] || 0) + 1,
                },
            }),
            {} as ITicketCheckInParsed,
        )
    }

    static parseFlat(model: TicketCheckInModel[]) {
        return model.reduce(
            (prev, curr) => ({
                ...prev,
                [curr.idItem]: (prev[curr.idItem] || 0) + 1,
            }),
            {} as ITicketCheckInFlat,
        )
    }
}
