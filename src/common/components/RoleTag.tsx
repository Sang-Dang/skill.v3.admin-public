import { Role } from '@/lib/enum/role.enum'
import { Tag } from 'antd'

type RoleTagProps = {
    role: Role
}
export default function RoleTag({ role }: RoleTagProps) {
    let roleColor = ''
    switch (role) {
        case Role.ADMIN:
            roleColor = 'red-inverse'
            break
        case Role.USER:
            roleColor = 'green-inverse'
            break
        case Role.STAFF:
            roleColor = 'blue-inverse'
            break
    }

    return (
        <Tag
            color={roleColor}
            style={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
            }}
        >
            {role}
        </Tag>
    )
}
