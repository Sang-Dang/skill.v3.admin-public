import ContentWrapper from '@/common/components/ContentWrapper'
import RoleTag from '@/common/components/RoleTag'
import { AuthModel } from '@/lib/model/auth.model'
import { DeleteOutlined, IdcardOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { App, Dropdown, Pagination, Table, theme } from 'antd'
import dayjs from 'dayjs'

type AccountTableProps = {
    page: number
    limit: number
    isLoading: boolean
    accounts: TableData<AuthModel>
}

export default function BaseAccountsTable({ page, limit, accounts, isLoading }: AccountTableProps) {
    const navigate = useNavigate()
    const { message } = App.useApp()
    const { token } = theme.useToken()

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
                            width: 150,
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
                            title: 'Action',
                            fixed: 'right',
                            width: 150,
                            render: (_, record) => (
                                <Dropdown.Button
                                    style={{
                                        float: 'right',
                                        display: 'inline',
                                    }}
                                    size='middle'
                                    menu={{
                                        items: [
                                            {
                                                label: 'Copy ID',
                                                key: 'accounts-copyId',
                                                onClick: () => {
                                                    navigator.clipboard.writeText(record.id)
                                                    message.success('ID copied to clipboard')
                                                },
                                                icon: <IdcardOutlined />,
                                            },
                                            {
                                                label: 'Delete',
                                                key: 'accounts-deleteBtn',
                                                icon: <DeleteOutlined />,
                                                danger: true,
                                            },
                                        ],
                                    }}
                                    onClick={() =>
                                        navigate({
                                            to: '/accounts/$id',
                                            params: {
                                                id: record.id,
                                            },
                                        })
                                    }
                                >
                                    View
                                </Dropdown.Button>
                            ),
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
