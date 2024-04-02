import { Accounts_GetById } from '@/api/accounts/Accounts_GetById'
import { accountQueryKeys } from '@/api/accounts/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import RoleTag from '@/common/components/RoleTag'
import { NotFoundError } from '@/lib/errors/NotFoundError'
import DeleteAccountModal from '@/routes/_dashboard-layout/accounts/-modals/DeleteAccountModal'
import { DeleteOutlined } from '@ant-design/icons'
import { Await, createFileRoute, defer, notFound } from '@tanstack/react-router'
import { Card, Descriptions, Dropdown, Flex, Space, Typography } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/accounts/$id')({
    component: AccountDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { authHandler, queryClient }, params: { id } }) => {
        const data = queryClient
            .ensureQueryData({
                queryKey: accountQueryKeys.GetById(id),
                queryFn: () => Accounts_GetById({ token: authHandler.getToken(), payload: { id } }),
            })
            .catch((error) => {
                if (error instanceof NotFoundError) {
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
            <Await promise={account} fallback={<Card loading />}>
                {(account) => {
                    return (
                        <>
                            <Flex
                                justify='space-between'
                                style={{
                                    marginBottom: '25px',
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
                                                            onClick: () => handleOpen(account.data.id),
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
                            <Descriptions
                                column={{
                                    xs: 1,
                                    sm: 2,
                                }}
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
