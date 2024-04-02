export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    STAFF = 'staff',
}

export function getRoleNumber(role: Role) {
    switch (role) {
        case Role.ADMIN:
            return 10
        case Role.USER:
            return 1
        case Role.STAFF:
            return 5
        default:
            throw new Error(`Role ${role} not found`)
    }
}
