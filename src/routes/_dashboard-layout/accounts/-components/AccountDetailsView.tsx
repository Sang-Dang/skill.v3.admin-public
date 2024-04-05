import ContentWrapper from '@/common/components/ContentWrapper'
import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import RoleTag from '@/common/components/RoleTag'
import SingleActionModal from '@/common/components/SingleActionModal'
import { AuthModel } from '@/lib/model/auth.model'
import { AccountBreadcrumbs } from '@/routes/_dashboard-layout/accounts/-breadcrumbs'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { DeleteOutlined } from '@ant-design/icons'
import { UseQueryResult } from '@tanstack/react-query'
import { Card, Descriptions, Dropdown, Flex, Grid, Space, Typography } from 'antd'
import { AxiosError } from 'axios'

type Props = {
    account: UseQueryResult<AuthModel, AxiosError<unknown, any>>
}

export default function AccountDetailsView({ account }: Props) {
    const screens = Grid.useBreakpoint()

    return (
        <ContentWrapper
            headTitle={'Account Details'}
            title='Account Details'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                AccountBreadcrumbs.static.index,
                AccountBreadcrumbs.dynamic.$id(account.data?.id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            {account.isSuccess ? (
                <>
                    <Flex
                        justify='space-between'
                        style={{
                            marginBottom: '25px',
                            paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                        }}
                    >
                        <Typography.Title level={4}>Account Metadata</Typography.Title>
                        <Space>
                            <SingleActionModal onOk={() => {}}>
                                {({ ho: handleOpen }) => (
                                    <Dropdown.Button
                                        menu={{
                                            items: [
                                                CopyToClipboardMenuItem(account.data.id),
                                                {
                                                    key: 'delete-account',
                                                    label: 'Delete',
                                                    danger: true,
                                                    icon: <DeleteOutlined />,
                                                    onClick: () => handleOpen(),
                                                },
                                            ],
                                        }}
                                    >
                                        Update
                                    </Dropdown.Button>
                                )}
                            </SingleActionModal>
                        </Space>
                    </Flex>
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
            ) : (
                <>
                    {account.isError && <Typography.Text type='danger'>{account.error.message}</Typography.Text>}
                    {account.isLoading && <Card loading />}
                </>
            )}
        </ContentWrapper>
    )
}
