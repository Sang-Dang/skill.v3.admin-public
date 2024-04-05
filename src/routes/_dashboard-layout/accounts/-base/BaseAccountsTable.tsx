import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import RoleTag from '@/common/components/RoleTag'
import { AuthModel } from '@/lib/model/auth.model'
import dayjs from 'dayjs'

export default function BaseAccountsTable(props: BaseTablePropsCommon<AuthModel>) {
    return (
        <BaseTable
            columns={[
                {
                    key: 'accountsTable-username',
                    title: 'Username',
                    dataIndex: 'username',
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: 'accountsTable-email',
                    title: 'Email',
                    dataIndex: 'email',
                    width: 220,
                    ellipsis: true,
                },
                {
                    key: 'accountsTable-phone',
                    title: 'Phone',
                    dataIndex: 'phone',
                    width: 200,
                    ellipsis: true,
                },
                {
                    key: 'accountsTable-role',
                    title: 'Role',
                    dataIndex: 'role',
                    render: (role) => <RoleTag role={role} />,
                    width: 120,
                },
                {
                    key: 'accountsTable-createdAt',
                    title: 'Created',
                    dataIndex: 'createdAt',
                    render: (createdAt) => dayjs(createdAt).format('YYYY-MM-DD, HH:mm'),
                    width: 200,
                },
                BaseTable.ColumnActions({
                    viewLink: '/accounts/$id',
                    appendActions: props.appendActions,
                }),
            ]}
            {...props}
        />
    )
}
