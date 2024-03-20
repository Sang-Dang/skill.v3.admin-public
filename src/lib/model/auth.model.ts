import { Role } from "@/lib/enum/role.enum"
import { BaseModel } from "@/lib/model/base.model"

export class AuthModel extends BaseModel {
    username: string
    email: string
    phone: string
    password: string
    role: Role

    constructor(data: AuthModel) {
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
}
