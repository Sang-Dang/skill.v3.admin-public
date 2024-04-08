import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import { TicketOrders_GetById } from '@/api/tickets/orders/TicketOrders_GetById'
import ContentWrapper from '@/common/components/ContentWrapper'
import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import BaseOrderItemsTable from '@/routes/_dashboard-layout/tickets/orders/-base/BaseOrderItemsTable'
import BaseTransactionsTable from '@/routes/_dashboard-layout/tickets/orders/-base/BaseTransactionsTable'
import { TicketOrdersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/orders/-breadcrumbs'
import { TicketOrderIdTabs } from '@/routes/_dashboard-layout/tickets/orders/-utils/TicketOrderIdTabs.enum'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router'
import { Button, Descriptions, Dropdown, Flex, Grid, Skeleton, Space, Steps, Tabs, Typography } from 'antd'
import { useMemo } from 'react'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/orders/$id')({
    component: TicketOrderDetails,
    notFoundComponent: () => <DetailsNotFound />,
})

function TicketOrderDetails() {
    const id = Route.useParams({ select: (params) => params.id })
    const screens = Grid.useBreakpoint()
    const ticket = useQuery({
        queryKey: ticketOrdersQueryKeys.GetById(id),
        queryFn: () => TicketOrders_GetById({ id }),
        select: (res) => res.data,
        throwOnError(error) {
            if (error instanceof ResourceNotFoundError) {
                throw notFound({
                    routeId: Route.options.id as any,
                })
            }

            throw error
        },
    })
    const search = Route.useSearch({
        select: (search) => ({
            tab: search.tab ?? TicketOrderIdTabs.ORDER_ITEMS,
            OIPage: search.OIPage ?? 1,
            OILimit: search.OILimit ?? 7,
            TPage: search.TPage ?? 1,
            TLimit: search.TLimit ?? 7,
        }),
    })

    const navigate = useNavigate()
    const project = useQuery({
        queryKey: projectQueryKeys.GetById(ticket.data?.project ?? ''),
        queryFn: () => Project_GetById({ id: ticket.data?.project ?? '' }),
        enabled: ticket.isSuccess,
        select: (res) => res.data,
    })

    const isXs = useMemo(() => screens.xs, [screens.xs])

    return (
        <ContentWrapper
            headTitle={'Ticket Order Details'}
            title='Ticket Order Details'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                TicketOrdersBreadcrumbs.static.index,
                TicketOrdersBreadcrumbs.dynamic.$id(ticket.data?.id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            {ticket.isSuccess ? (
                <>
                    <Flex
                        justify='space-between'
                        style={{
                            marginBottom: '25px',
                            paddingInline: isXs ? 'var(--page-padding-inline-mobile)' : '0',
                        }}
                    >
                        <Typography.Title level={4}>Ticket Order Metadata</Typography.Title>
                        <Space>
                            <Dropdown
                                menu={{
                                    items: [CopyToClipboardMenuItem(id)],
                                }}
                            >
                                <Button>Actions</Button>
                            </Dropdown>
                        </Space>
                    </Flex>
                    <div className='grid grid-cols-1 xl:grid-cols-4 xl:gap-5'>
                        <div className='col-span-3'>
                            <Descriptions
                                column={{
                                    xs: 1,
                                    sm: 2,
                                    md: 2,
                                    lg: 2,
                                    xl: 2,
                                    xxl: 2,
                                }}
                                style={{
                                    paddingInline: isXs ? 'var(--page-padding-inline-mobile)' : '0',
                                    marginBottom: '20px',
                                }}
                                bordered={isXs}
                                items={[
                                    {
                                        key: 'ticketOrderDetails-createdAt',
                                        label: 'Creation Time',
                                        children: ticket.data.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketOrderDetails-updatedAt',
                                        label: 'Last Updated',
                                        children: ticket.data.updatedAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketOrderDetails-status',
                                        label: 'Status',
                                        children: ticket.data.status,
                                    },
                                    {
                                        key: 'ticketOrderDetails-total',
                                        label: 'Total',
                                        children: ticket.data.total.toLocaleString() + ' VND',
                                    },
                                    {
                                        key: 'ticketOrderDetails-ticketVoucher',
                                        label: 'Vouchers Applied',
                                        children:
                                            (
                                                <Link to='/tickets/vouchers/$id' params={{ id: ticket.data.ticketVoucher.id }}>
                                                    {ticket.data.ticketVoucher.voucherCode}
                                                </Link>
                                            ) || 'None',
                                    },
                                    {
                                        key: 'ticketOrderDetails-project',
                                        label: 'Project',
                                        children: (
                                            <>
                                                {project.isLoading && <Skeleton.Input style={{ width: 200 }} active />}
                                                {project.isError && <Typography.Text type='danger'>An error has occurred</Typography.Text>}
                                                {project.isSuccess && (
                                                    <Link to={'/projects/$id'} params={{ id: ticket.data.project }}>
                                                        {project.data?.projectName}
                                                    </Link>
                                                )}
                                            </>
                                        ),
                                    },
                                    {
                                        key: 'ticketOrderDetails-numberOfItems',
                                        label: 'Number of Items',
                                        children: ticket.data.items.length,
                                    },
                                ]}
                            />
                            <ContentWrapper.ContentCard
                                useCard
                                cardProps={{
                                    className: 'hidden xl:block w-full',
                                }}
                            >
                                <Steps
                                    current={Object.values(TicketOrderStatus).indexOf(ticket.data.status)}
                                    items={Object.values(TicketOrderStatus).map((stat) => ({
                                        title: <span className='capitalize'>{stat}</span>,
                                        ...(function () {
                                            switch (stat) {
                                                case TicketOrderStatus.PENDING:
                                                    return {
                                                        description: 'Waiting for payment',
                                                        // status: 'wait',
                                                    }
                                                case TicketOrderStatus.PAID:
                                                    return {
                                                        description: 'Payment successful',
                                                        // status: 'finish',
                                                    }
                                                case TicketOrderStatus.EXPIRED:
                                                    return {
                                                        description: 'Payment expired',
                                                        // status: 'error',
                                                    }
                                                default:
                                                    return {
                                                        description: 'Unknown status',
                                                        status: 'error',
                                                    }
                                            }
                                        })(),
                                    }))}
                                />
                            </ContentWrapper.ContentCard>
                        </div>
                        <ContentWrapper.ContentCard
                            useCard
                            cardProps={{
                                title: 'Customer information',
                                className: 'w-full',
                                actions: [
                                    <Link to='/accounts/email' search={{ email: ticket.data.email }}>
                                        <Button>View</Button>
                                    </Link>,
                                ],
                            }}
                        >
                            <Descriptions
                                layout='horizontal'
                                className='w-full'
                                column={1}
                                items={[
                                    {
                                        key: 'ticketOrderDetails-customerName',
                                        label: 'Username',
                                        children: (
                                            <Typography.Paragraph
                                                className='mb-0 w-full'
                                                ellipsis={{
                                                    rows: 1,
                                                }}
                                                copyable
                                            >
                                                {ticket.data.username}
                                            </Typography.Paragraph>
                                        ),
                                    },
                                    {
                                        key: 'ticketOrderDetails-customerEmail',
                                        label: 'Email',
                                        children: (
                                            <Typography.Paragraph
                                                className='mb-0 w-full'
                                                ellipsis={{
                                                    rows: 1,
                                                }}
                                                copyable
                                            >
                                                {ticket.data.email}
                                            </Typography.Paragraph>
                                        ),
                                    },
                                    {
                                        key: 'ticketOrderDetails-customerPhone',
                                        label: 'Phone',
                                        children: (
                                            <Typography.Paragraph
                                                className='mb-0 w-full'
                                                ellipsis={{
                                                    rows: 1,
                                                }}
                                                copyable
                                            >
                                                {ticket.data.phone}
                                            </Typography.Paragraph>
                                        ),
                                    },
                                ]}
                            />
                        </ContentWrapper.ContentCard>
                    </div>
                    <Tabs
                        defaultActiveKey={search.tab}
                        className='mt-5'
                        type='card'
                        tabBarStyle={{
                            margin: 0,
                        }}
                        onTabClick={(key: string) => {
                            navigate({
                                search: {
                                    tab: key,
                                },
                            })
                        }}
                        // tabBarExtraContent={<RefreshButton queryKey={ticketsQueryKeys.GetAll()} />}
                        items={[
                            {
                                key: TicketOrderIdTabs.ORDER_ITEMS,
                                label: 'Ordered Items',
                                children: (
                                    <BaseOrderItemsTable
                                        data={{
                                            list: ticket.data.items,
                                            total: ticket.data.items.length,
                                        }}
                                        isLoading={ticket.isPending}
                                        limit={search.OILimit}
                                        page={search.OIPage}
                                        tableWrapperProps={{
                                            style: {
                                                borderTopLeftRadius: 0,
                                            },
                                        }}
                                    />
                                ),
                            },
                            {
                                key: TicketOrderIdTabs.PAYMENTS,
                                label: 'Payments',
                                disabled: ticket.data.payment === null,
                                children: ticket.data.payment !== null && (
                                    <ContentWrapper.ContentCard useCard>
                                        <Descriptions
                                            bordered={isXs}
                                            column={{
                                                xs: 1,
                                                sm: 2,
                                                md: 2,
                                                lg: 2,
                                            }}
                                            items={[
                                                {
                                                    key: 'ticketOrderDetails-amount',
                                                    label: 'Amount',
                                                    children: ticket.data.payment.amount.toLocaleString() + ' VND',
                                                },
                                                {
                                                    key: 'ticketOrderDetails-createdAt',
                                                    label: 'Creation Time',
                                                    children: ticket.data.payment.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                                                },
                                                {
                                                    key: 'ticketOrderDetails-status',
                                                    label: 'Status',
                                                    children: ticket.data.payment.status,
                                                },
                                                {
                                                    key: 'ticketOrderDetails-orderCode',
                                                    label: 'Order Code',
                                                    children: ticket.data.payment.orderCode,
                                                },
                                                {
                                                    key: 'ticketOrderDetails-amountPaid',
                                                    label: 'Amount Paid',
                                                    children: ticket.data.payment.amountPaid.toLocaleString() + ' VND',
                                                },
                                                {
                                                    key: 'ticketOrderDetails-amountRemaining',
                                                    label: 'Amount Remaining',
                                                    children: ticket.data.payment.amountRemaining.toLocaleString() + ' VND',
                                                },
                                                {
                                                    key: 'ticketOrderDetails-canceledAt',
                                                    label: 'Canceled At',
                                                    children: ticket.data.payment.canceledAt
                                                        ? ticket.data.payment.canceledAt.format('YYYY-MM-DD HH:mm:ss')
                                                        : 'Not canceled',
                                                },
                                                {
                                                    key: 'ticketOrderDetails-cancellationReason',
                                                    label: 'Cancellation Reason',
                                                    children: ticket.data.payment.cancellationReason || 'None',
                                                },
                                            ]}
                                        />
                                        <BaseTransactionsTable
                                            data={{
                                                list: ticket.data.payment.transactions,
                                                total: ticket.data.payment.transactions.length,
                                            }}
                                            isLoading={ticket.isPending}
                                            limit={search.TLimit}
                                            page={search.TPage}
                                            tableWrapperProps={{
                                                style: {
                                                    padding: 0,
                                                    marginTop: 20,
                                                },
                                            }}
                                        />
                                    </ContentWrapper.ContentCard>
                                ),
                            },
                        ]}
                    />
                </>
            ) : (
                <>
                    {ticket.isPending && <Skeleton active />}
                    {ticket.isError && <Typography.Text type='danger'>An error has occurred</Typography.Text>}
                </>
            )}
        </ContentWrapper>
    )
}
