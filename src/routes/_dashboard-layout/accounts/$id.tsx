import { Accounts_GetById } from '@/api/accounts/Accounts_GetById'
import { accountQueryKeys } from '@/api/accounts/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import RoleTag from '@/common/components/RoleTag'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import DeleteAccountModal from '@/routes/_dashboard-layout/accounts/-modals/DeleteAccountModal'
import { DeleteOutlined } from '@ant-design/icons'
import { Await, createFileRoute, defer, notFound } from '@tanstack/react-router'
import { Card, Descriptions, Dropdown, Flex, Grid, Space, Typography } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/accounts/$id')({
    component: AccountDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        const data = queryClient
            .ensureQueryData({
                queryKey: accountQueryKeys.GetById(id),
                queryFn: () => Accounts_GetById({ id }),
            })
            .catch((error) => {
                if (error instanceof ResourceNotFoundError) {
                    throw notFound({
                        routeId: Route.id,
                    })
                }

                throw error
            })

        return {
            account: defer(data),
        }
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function AccountDetails() {
    const account = Route.useLoaderData({ select: (res) => res.account })
    const screens = Grid.useBreakpoint()
    const id = Route.useParams({ select: (params) => params.id })

    return (
        <ContentWrapper
            headTitle={'Account Details'}
            title='Account Details'
            breadcrumbs={[
                {
                    breadcrumbName: 'Home',
                    href: '/dashboard',
                    title: 'Home',
                },
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            <Flex
                justify='space-between'
                style={{
                    marginBottom: '25px',
                    paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                }}
            >
                <Typography.Title level={4}>Account Metadata</Typography.Title>
                <Space>
                    <DeleteAccountModal>
                        {({ handleOpen }) => (
                            <Dropdown.Button
                                menu={{
                                    items: [
                                        {
                                            key: 'delete-account',
                                            label: 'Delete',
                                            danger: true,
                                            icon: <DeleteOutlined />,
                                            onClick: () => handleOpen(id),
                                        },
                                    ],
                                }}
                            >
                                Update
                            </Dropdown.Button>
                        )}
                    </DeleteAccountModal>
                </Space>
            </Flex>
            <Await promise={account} fallback={<Card loading />}>
                {(account) => {
                    return (
                        <>
                            <Descriptions
                                column={{
                                    xs: 1,
                                    sm: 2,
                                }}
                                style={{
                                    paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                                    marginBottom: '20px',
                                }}
                                bordered={screens.xs}
                                items={[
                                    {
                                        key: 'accountDetails-createdAt',
                                        label: 'Creation Time',
                                        children: account.data.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'accountDetails-updatedAt',
                                        label: 'Last Updated',
                                        children: account.data.updatedAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'accountDetails-username',
                                        label: 'Username',
                                        children: account.data.username,
                                    },
                                    {
                                        key: 'accountDetails-email',
                                        label: 'Email',
                                        children: account.data.email,
                                    },
                                    {
                                        key: 'accountDetails-phone',
                                        label: 'Phone',
                                        children: account.data.phone,
                                    },
                                    {
                                        key: 'accountDetails-role',
                                        label: 'Role',
                                        children: <RoleTag role={account.data.role} />,
                                    },
                                ]}
                            />
                        </>
                    )
                }}
            </Await>
        </ContentWrapper>
    )
}
