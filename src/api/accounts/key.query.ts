import { Role } from '@/lib/enum/role.enum'

export const accountQueryKeys = {
    GetAll: ['accounts'],
    GetAllByRole: (role: Role) => ['accounts', role],
    GetById: (id: string) => ['accounts', id],
}
