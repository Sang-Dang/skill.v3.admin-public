import dayjs, { Dayjs } from 'dayjs'

export interface ITransaction {
    amount: number
    reference: string
    description: string
    accountNumber: string
    counterAccountName: string
    virtualAccountName: string | null
    transactionDateTime: Dayjs
    counterAccountBankId: string | null
    counterAccountNumber: string
    virtualAccountNumber: string | null
    counterAccountBankName: string | null
}

export class TransactionModel implements ITransaction {
    amount: number
    reference: string
    description: string
    accountNumber: string
    counterAccountName: string
    virtualAccountName: string | null
    transactionDateTime: Dayjs
    counterAccountBankId: string | null
    counterAccountNumber: string
    virtualAccountNumber: string | null
    counterAccountBankName: string | null

    constructor(data: ITransaction) {
        this.amount = data.amount
        this.reference = data.reference
        this.description = data.description
        this.accountNumber = data.accountNumber
        this.counterAccountName = data.counterAccountName
        this.virtualAccountName = data.virtualAccountName
        this.transactionDateTime = data.transactionDateTime
        this.counterAccountBankId = data.counterAccountBankId
        this.counterAccountNumber = data.counterAccountNumber
        this.virtualAccountNumber = data.virtualAccountNumber
        this.counterAccountBankName = data.counterAccountBankName
    }

    static fromJSON(record: Record<string, any>): TransactionModel {
        return new TransactionModel({
            amount: record.amount,
            reference: record.reference,
            description: record.description,
            accountNumber: record.accountNumber,
            counterAccountName: record.counterAccountName,
            virtualAccountName: record.virtualAccountName,
            transactionDateTime: dayjs(record.transactionDateTime),
            counterAccountBankId: record.counterAccountBankId,
            counterAccountNumber: record.counterAccountNumber,
            virtualAccountNumber: record.virtualAccountNumber,
            counterAccountBankName: record.counterAccountBankName,
        })
    }

    static fromJSONList(records: Record<string, any>[]): TransactionModel[] {
        return records.map((record) => TransactionModel.fromJSON(record))
    }

    static serialize(model: Partial<TransactionModel>): { [key in keyof ITransaction]: any } {
        return {
            amount: model.amount,
            reference: model.reference,
            description: model.description,
            accountNumber: model.accountNumber,
            counterAccountName: model.counterAccountName,
            virtualAccountName: model.virtualAccountName,
            transactionDateTime: model.transactionDateTime?.toISOString(),
            counterAccountBankId: model.counterAccountBankId,
            counterAccountNumber: model.counterAccountNumber,
            virtualAccountNumber: model.virtualAccountNumber,
            counterAccountBankName: model.counterAccountBankName,
        }
    }
}
