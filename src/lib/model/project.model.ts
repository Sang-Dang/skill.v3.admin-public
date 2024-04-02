import { BaseModel, IBase } from '@/lib/model/base.model'
import dayjs, { Dayjs } from 'dayjs'

export interface IProject extends IBase {
    projectName: string
    description: string
    startDate: Dayjs
    endDate: Dayjs
}

export class ProjectModel extends BaseModel implements IProject {
    projectName: string
    description: string
    startDate: Dayjs
    endDate: Dayjs

    constructor(data: IProject) {
        super(data)
        this.projectName = data.projectName
        this.description = data.description
        this.startDate = data.startDate
        this.endDate = data.endDate
    }

    static fromJSON(record: Record<string, any>): ProjectModel {
        return new ProjectModel({
            ...super.fromJSON(record),
            projectName: record.projectName,
            description: record.description,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
        })
    }

    static fromJSONList(records: Record<string, any>[]): ProjectModel[] {
        return records.map((record) => ProjectModel.fromJSON(record))
    }

    static serialize(model: Partial<ProjectModel>): { [key in keyof IProject]: any } {
        return {
            ...BaseModel.serialize(model),
            projectName: model.projectName,
            description: model.description,
            startDate: model.startDate?.toISOString(),
            endDate: model.endDate?.toISOString(),
        }
    }
}
