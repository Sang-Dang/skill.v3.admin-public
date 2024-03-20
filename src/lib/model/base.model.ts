import { Dayjs } from "dayjs"

export class BaseModel {
    id: string
    createdAt: Dayjs
    updatedAt: Dayjs
    deletedAt: Dayjs | null

    constructor(data: BaseModel) {
        this.id = data.id
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.deletedAt = data.deletedAt
    }

    static fromJSON(record: Record<string, any>) {
        return new BaseModel({
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt === null ? null : record.deletedAt,
        })
    }
}
