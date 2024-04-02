import ContentWrapper from '@/common/components/ContentWrapper'
import RoleTag from '@/common/components/RoleTag'
import TableActionsButton from '@/common/components/TableActionsButton'
import { AuthModel } from '@/lib/model/auth.model'
import { useNavigate } from '@tanstack/react-router'
import { Grid, Pagination, Table, theme } from 'antd'
import dayjs from 'dayjs'

type AccountTableProps = {
    page: number
    limit: number
    isLoading: boolean
    accounts: TableData<AuthModel>
}

export default function BaseAccountsTable({ page, limit, accounts, isLoading }: AccountTableProps) {
    const navigate = useNavigate()
    const { token } = theme.useToken()
    const screens = Grid.useBreakpoint()

    return (
        <>
            <ContentWrapper.ContentCard
                style={{
                    borderTopLeftRadius: 0,
                }}
            >
                <Table
                    loading={isLoading}
                    dataSource={accounts?.list ?? []}
                    virtual
                    tableLayout='fixed'
                    bordered
                    columns={[
                        {
                            key: 'accountsTable-number',
                            title: '#',
                            render: (_, __, index) => (page - 1) * limit + index + 1,
                            width: 50,
                            ellipsis: true,
                        },
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
                        {
                            key: 'accountsTable-action',
                            title: screens.xs ? 'Atn.' : 'Action',
                            fixed: 'right',
                            width: screens.xs ? 65 : 130,
                            // ! URL
                            render: (_, record) => <TableActionsButton record={record} viewLink='/accounts/$id' />,
                        },
                    ]}
                    pagination={false}
                />
            </ContentWrapper.ContentCard>
            <ContentWrapper.ContentCard
                style={{
                    marginTop: 25,
                    width: 'max-content',
                    borderTopLeftRadius: token.borderRadiusLG,
                }}
            >
                <Pagination
                    total={accounts?.total}
                    pageSize={limit}
                    defaultCurrent={page}
                    current={page}
                    onChange={(page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page,
                                limit,
                            }),
                        })
                    }}
                    onShowSizeChange={(page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page,
                                limit,
                            }),
                        })
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} items`}
                    pageSizeOptions={[8, 16, 24, 32]}
                />
            </ContentWrapper.ContentCard>
        </>
    )
}
