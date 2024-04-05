export interface ICreateTicketOrderResponse {
    code: string
    desc: string
    data: {
        bin: string
        accountNumber: string
        accountName: string
        amount: number
        description: string
        orderCode: number
        currency: string
        paymentLinkId: string
        status: string
        expiredAt: number
        checkoutUrl: string
        qrCode: string
    }
    signature: string
}

export class CreateTicketOrderResponseModel implements ICreateTicketOrderResponse {
    code: string
    desc: string
    data: ICreateTicketOrderResponse['data']
    signature: string

    constructor(data: ICreateTicketOrderResponse) {
        this.code = data.code
        this.desc = data.desc
        this.data = data.data
        this.signature = data.signature
    }

    static fromJSON(record: Record<string, any>): CreateTicketOrderResponseModel {
        return new CreateTicketOrderResponseModel({
            code: record.code,
            desc: record.desc,
            data: {
                bin: record.data.bin,
                accountNumber: record.data.accountNumber,
                accountName: record.data.accountName,
                amount: record.data.amount,
                description: record.data.description,
                orderCode: record.data.orderCode,
                currency: record.data.currency,
                paymentLinkId: record.data.paymentLinkId,
                status: record.data.status,
                expiredAt: record.data.expiredAt,
                checkoutUrl: record.data.checkoutUrl,
                qrCode: record.data.qrCode,
            },
            signature: record.signature,
        })
    }

    static fromJSONList(records: Record<string, any>[]): CreateTicketOrderResponseModel[] {
        return records.map((record) => CreateTicketOrderResponseModel.fromJSON(record))
    }

    static serialize(model: Partial<CreateTicketOrderResponseModel>): { [key in keyof ICreateTicketOrderResponse]: any } {
        return {
            code: model.code,
            desc: model.desc,
            data: {
                bin: model.data?.bin,
                accountNumber: model.data?.accountNumber,
                accountName: model.data?.accountName,
                amount: model.data?.amount,
                description: model.data?.description,
                orderCode: model.data?.orderCode,
                currency: model.data?.currency,
                paymentLinkId: model.data?.paymentLinkId,
                status: model.data?.status,
                expiredAt: model.data?.expiredAt,
                checkoutUrl: model.data?.checkoutUrl,
                qrCode: model.data?.qrCode,
            },
            signature: model.signature,
        }
    }
}
