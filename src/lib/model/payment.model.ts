import { TransactionModel } from '@/lib/model/transaction.model'
import dayjs, { Dayjs } from 'dayjs'

export interface IPayment {
    id: string
    amount: number
    status: string
    createdAt: Dayjs
    orderCode: number
    amountPaid: number
    canceledAt: Dayjs | null
    transactions: TransactionModel[]
    amountRemaining: number
    cancellationReason: string | null
}

export class PaymentModel implements IPayment {
    id: string
    amount: number
    status: string
    createdAt: Dayjs
    orderCode: number
    amountPaid: number
    canceledAt: Dayjs | null
    transactions: TransactionModel[]
    amountRemaining: number
    cancellationReason: string | null

    constructor(data: IPayment) {
        this.id = data.id
        this.amount = data.amount
        this.status = data.status
        this.createdAt = data.createdAt
        this.orderCode = data.orderCode
        this.amountPaid = data.amountPaid
        this.canceledAt = data.canceledAt
        this.transactions = data.transactions
        this.amountRemaining = data.amountRemaining
        this.cancellationReason = data.cancellationReason
    }

    static fromJSON(record: Record<string, any>): PaymentModel {
        return new PaymentModel({
            id: record.id,
            amount: record.amount,
            status: record.status,
            createdAt: dayjs(record.createdAt),
            orderCode: record.orderCode,
            amountPaid: record.amountPaid,
            canceledAt: record.cancelledAt ? dayjs(record.canceledAt) : null,
            transactions: TransactionModel.fromJSONList(record.transactions),
            amountRemaining: record.amountRemaining,
            cancellationReason: record.cancellationReason,
        })
    }

    static fromJSONList(records: Record<string, any>[]): PaymentModel[] {
        return records.map((record) => PaymentModel.fromJSON(record) as PaymentModel)
    }

    static serialize(model: Partial<PaymentModel>): { [key in keyof IPayment]: any } {
        return {
            id: model.id,
            amount: model.amount,
            status: model.status,
            createdAt: model.createdAt?.toISOString(),
            orderCode: model.orderCode,
            amountPaid: model.amountPaid,
            canceledAt: model.canceledAt?.toISOString(),
            transactions: model.transactions?.map((t) => TransactionModel.serialize(t)),
            amountRemaining: model.amountRemaining,
            cancellationReason: model.cancellationReason,
        }
    }
}
