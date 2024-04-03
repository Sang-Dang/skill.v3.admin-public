import BaseTable from '@/common/components/BaseTable'
import { ContentCardProps } from '@/common/components/ContentWrapper'
import RoleTag from '@/common/components/RoleTag'
import { AuthModel } from '@/lib/model/auth.model'
import { Grid, MenuProps } from 'antd'
import dayjs from 'dayjs'

type AccountTableProps = {
    page: number
    limit: number
    isLoading: boolean
    accounts: TableData<AuthModel>
    tableWrapperProps?: Partial<ContentCardProps>
    appendActions?: (record: AuthModel) => MenuProps['items']
}

export default function BaseAccountsTable({ page, limit, accounts, isLoading, tableWrapperProps, appendActions }: AccountTableProps) {
    const screens = Grid.useBreakpoint()

    return (
        <BaseTable
            isLoading={isLoading}
            data={accounts}
            page={page}
            limit={limit}
            tableWrapperProps={tableWrapperProps}
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
                    screens,
                    viewLink: '/accounts/$id',
                    appendActions: appendActions,
                }),
            ]}
        />
    )
}
