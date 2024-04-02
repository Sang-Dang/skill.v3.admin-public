import { Role } from '@/lib/enum/role.enum'
import { BaseModel, IBase } from '@/lib/model/base.model'

interface IAuth extends IBase {
    username: string
    email: string
    phone: string
    password: string
    role: Role
}

export class AuthModel extends BaseModel implements IAuth {
    username: string
    email: string
    phone: string
    password: string
    role: Role

    constructor(data: IAuth) {
        super(data)
        this.username = data.username
        this.email = data.email
        this.phone = data.phone
        this.password = data.password
        this.role = data.role
    }

    static fromJSON(record: Record<string, any>): AuthModel {
        return new AuthModel({
            ...super.fromJSON(record),
            username: record.username,
            email: record.email,
            phone: record.phone,
            password: record.password,
            role: record.role,
        })
    }

    static fromJSONList(records: Record<string, any>[]): AuthModel[] {
        return records.map((record) => AuthModel.fromJSON(record))
    }

    static serialize(model: AuthModel): { [key in keyof IAuth]: string } {
        return {
            ...BaseModel.serialize(model),
            username: model.username,
            email: model.email,
            phone: model.phone,
            password: model.password,
            role: model.role,
        }
    }
}
