import { Role } from '@/lib/enum/role.enum'

export type Token = {
    id: string
    username: string
    email: string
    role: Role
    exp: number
}
