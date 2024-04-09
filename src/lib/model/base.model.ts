import dayjs, { Dayjs } from 'dayjs'

export interface IBase {
    id: string
    key: string
    createdAt: Dayjs
    updatedAt: Dayjs
    deletedAt: Dayjs | null
}

export class BaseModel implements IBase {
    id: string
    key: string
    createdAt: Dayjs
    updatedAt: Dayjs
    deletedAt: Dayjs | null

    constructor(data: IBase) {
        this.id = data.id
        this.key = data.id
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.deletedAt = data.deletedAt
    }

    static fromJSON(record: Record<string, any>) {
        return new BaseModel({
            id: record.id,
            key: record.id,
            createdAt: dayjs(record.createdAt),
            updatedAt: dayjs(record.updatedAt),
            deletedAt: record.deletedAt === null ? null : dayjs(record.deletedAt),
        })
    }

    static serialize(model: Partial<BaseModel>): { [key in keyof IBase]: any } {
        return {
            id: model.id,
            key: model.id,
            createdAt: model.createdAt?.toISOString(),
            updatedAt: model.updatedAt?.toISOString(),
            deletedAt: model.deletedAt?.toISOString() ?? '',
        }
    }
}

