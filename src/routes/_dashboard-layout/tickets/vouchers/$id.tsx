import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetManyById } from '@/api/tickets/Tickets_GetManyById'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetById } from '@/api/tickets/voucher/TicketVoucher_GetById'
import ContentWrapper from '@/common/components/ContentWrapper'
import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import DisabledTag from '@/common/components/DisabledTag'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import { TicketVouchersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/vouchers/-breadcrumbs'
import CreateOrUpdateVoucherModal from '@/routes/_dashboard-layout/tickets/vouchers/-modals/CreateOrUpdateVoucherModal'
import DisableTicketVoucherModal from '@/routes/_dashboard-layout/tickets/vouchers/-modals/DisableTicketVoucherModal'
import UndisableTicketVoucherModal from '@/routes/_dashboard-layout/tickets/vouchers/-modals/UndisableTicketVoucherModal'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Descriptions, Dropdown, Flex, Grid, Skeleton, Space, Typography } from 'antd'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/tickets/vouchers/$id')({
    component: VoucherDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
    }),
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: ticketVoucherQueryKeys.GetById(id),
            queryFn: () => TicketVoucher_GetById({ id }),
        })
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function VoucherDetails() {
    const id = Route.useParams({ select: (params) => params.id })
    const voucher = useQuery({
        queryKey: ticketVoucherQueryKeys.GetById(id),
        queryFn: () => TicketVoucher_GetById({ id }),
        select: (data) => data.data,
        throwOnError(error) {
            if (error instanceof ResourceNotFoundError) {
                throw notFound({
                    routeId: Route.id,
                })
            }

            throw error
        },
    })
    const project = useQuery({
        queryKey: projectQueryKeys.GetFromVoucher(voucher.data),
        queryFn: () => Project_GetById({ id: voucher.data!.project }),
        enabled: voucher.isSuccess,
        select: (res) => res.data,
    })
    const screens = Grid.useBreakpoint()

    return (
        <ContentWrapper
            headTitle={'Voucher Details'}
            title='Voucher Details'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                TicketVouchersBreadcrumbs.static.index,
                TicketVouchersBreadcrumbs.dynamic.$id(voucher.data?.id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            {voucher.isLoading && <Skeleton active />}
            {voucher.isError && 'PLACEHOLDER FOR ERROR'}
            {voucher.isSuccess && (
                <>
                    <Flex
                        justify='space-between'
                        align='start'
                        style={{
                            marginBottom: '25px',
                            paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                        }}
                    >
                        <div>
                            <Typography.Title level={4}>Voucher Metadata</Typography.Title>
                            <DisabledTag disabledAt={voucher.data.deletedAt} showEnabled />
                        </div>
                        <Space>
                            <CreateOrUpdateVoucherModal>
                                {({ handleOpenUpdate }) => (
                                    <UndisableTicketVoucherModal>
                                        {({ handleOpen: handleUndisable }) => (
                                            <DisableTicketVoucherModal>
                                                {({ handleOpen: openDisable }) => (
                                                    <Dropdown.Button
                                                        onClick={() => handleOpenUpdate(id)}
                                                        menu={{
                                                            items: [
                                                                CopyToClipboardMenuItem(id),
                                                                voucher.data.deletedAt !== null
                                                                    ? {
                                                                          key: 'undisable',
                                                                          label: 'Undisable',
                                                                          icon: <UnlockOutlined />,
                                                                          onClick: () => handleUndisable(id),
                                                                      }
                                                                    : {
                                                                          key: 'disable',
                                                                          label: 'Disable',
                                                                          danger: true,
                                                                          icon: <LockOutlined />,
                                                                          onClick: () => openDisable(id),
                                                                      },
                                                            ],
                                                        }}
                                                    >
                                                        Update
                                                    </Dropdown.Button>
                                                )}
                                            </DisableTicketVoucherModal>
                                        )}
                                    </UndisableTicketVoucherModal>
                                )}
                            </CreateOrUpdateVoucherModal>
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
                                key: 'voucherDetails-createdAt',
                                label: 'Creation Time',
                                children: voucher.data.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                key: 'voucherDetails-updatedAt',
                                label: 'Last Updated',
                                children: voucher.data.updatedAt.format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                key: 'voucherDetails-voucherCode',
                                label: 'Voucher Code',
                                children: <Typography.Text copyable>{voucher.data.voucherCode}</Typography.Text>,
                            },
                            {
                                key: 'voucherDetails-discount',
                                label: 'Discount',
                                children: voucher.data.discount + ' VND',
                            },
                            {
                                key: 'voucherDetails-quantity',
                                label: 'Quantity',
                                children: voucher.data.quantity,
                            },
                            {
                                key: 'voucherDetails-project',
                                label: 'Project',
                                children: (
                                    <>
                                        {project.isError && <Typography.Text type='danger'>An error has occurred</Typography.Text>}
                                        {project.isLoading && <Skeleton.Input style={{ width: 200 }} active />}
                                        {project.isSuccess && (
                                            <Link to={'/projects/$id'} params={{ id: project.data.id }}>
                                                {project.data.projectName}
                                            </Link>
                                        )}
                                    </>
                                ),
                            },
                            {
                                key: 'voucherDetails-startDate',
                                label: 'Start Date',
                                children: voucher.data.startDate.format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                key: 'voucherDetails-endDate',
                                label: 'End Date',
                                children: voucher.data.endDate.format('YYYY-MM-DD HH:mm:ss'),
                            },
                        ]}
                    />
                    <ContentWrapper.ContentCard useCard cardProps={{ title: 'Notes' }}>
                        {voucher.data.note ?? 'No notes'}
                    </ContentWrapper.ContentCard>
                    <TicketsListView ticketIds={voucher.data.applyTicketId} />
                </>
            )}
        </ContentWrapper>
    )
}

function TicketsListView({ ticketIds }: { ticketIds: string[] }) {
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
        }),
    })
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetManyById(ticketIds),
        queryFn: () => Tickets_GetManyById({ ids: ticketIds }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <ContentWrapper.ContentCard
            useCard
            cardProps={{
                title: 'Tickets',
                style: {
                    marginTop: '15px',
                },
            }}
        >
            {tickets.isError && 'PLACEHOLDER FOR ERROR'}
            <TicketsTable
                isLoading={tickets.isLoading}
                data={tickets.data}
                page={page}
                limit={limit}
                tableWrapperProps={{
                    style: {
                        padding: 0,
                    },
                }}
            />
        </ContentWrapper.ContentCard>
    )
}
