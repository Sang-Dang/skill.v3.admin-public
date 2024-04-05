import { BaseModel, IBase } from '@/lib/model/base.model'

export interface IFile extends IBase {
    path: string
    size: number
}

export class FileModel extends BaseModel implements IFile {
    path: string
    size: number

    constructor(data: IFile) {
        super(data)
        this.path = data.path
        this.size = data.size
    }

    static fromJSON(record: Record<string, any>): BaseModel {
        return new FileModel({
            ...super.fromJSON(record),
            path: record.path,
            size: record.size,
        })
    }

    static fromJSONList(records: Record<string, any>[]): FileModel[] {
        return records.map((record) => FileModel.fromJSON(record) as FileModel)
    }

    static serialize(model: Partial<FileModel>): { [key in keyof IFile]: any } {
        return {
            ...super.serialize(model),
            path: model.path,
            size: model.size,
        }
    }
}
