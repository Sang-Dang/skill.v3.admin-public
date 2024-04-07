import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import { TicketOrders_GetAllByProjectId } from '@/api/tickets/orders/TicketOrders_GetAllByProjectId'
import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetAllByProjectId } from '@/api/tickets/voucher/TicketVoucher_GetAllByProjectId'
import ContentWrapper from '@/common/components/ContentWrapper'
import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import DisabledTag from '@/common/components/DisabledTag'
import RefreshButton from '@/common/components/ReloadButton'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import DisableProjectModal from '@/routes/_dashboard-layout/projects/-modals/DisableProjectModal'
import UndisableProjectModal from '@/routes/_dashboard-layout/projects/-modals/UndisableProjectModal'
import UpdateProjectModal from '@/routes/_dashboard-layout/projects/-modals/UpdateProjectModal'
import { ProjectIdTabs } from '@/routes/_dashboard-layout/projects/-utils/ProjectIdTabs.enum'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import CreateOrUpdateTicketModal from '@/routes/_dashboard-layout/tickets/-modals/CreateOrUpdateTicketModal'
import BaseTicketOrdersTable from '@/routes/_dashboard-layout/tickets/orders/-base/BaseTicketOrdersTable'
import BaseVouchersTable from '@/routes/_dashboard-layout/tickets/vouchers/-base/BaseVouchersTable'
import CreateOrUpdateVoucherModal from '@/routes/_dashboard-layout/tickets/vouchers/-modals/CreateOrUpdateVoucherModal'
import { DeleteOutlined, EditOutlined, LockOutlined, PlusOutlined, UnlockOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router'
import { Button, Descriptions, Dropdown, Flex, Grid, Space, Tabs, Typography } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/projects/$id')({
    component: ProjectDetails,
})

function ProjectDetails() {
    const id = Route.useParams({ select: (data) => data.id })
    const project = useQuery({
        queryKey: projectQueryKeys.GetById(id),
        queryFn: () => Project_GetById({ id }),
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
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint()
    const tab = Route.useSearch({ select: (data) => data.tab ?? ProjectIdTabs.TICKETS })

    return (
        <ContentWrapper
            headTitle={'Project Details'}
            title='Project Details'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                ProjectBreadcrumbs.static.index,
                ProjectBreadcrumbs.dynamic.$id(project.data?.id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            {project.isLoading && <ContentWrapper.LoadingCard />}
            {project.isSuccess && (
                <>
                    <Flex
                        justify='space-between'
                        align='start'
                        style={{
                            paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                            marginBottom: '25px',
                        }}
                    >
                        <div>
                            <Typography.Title level={4}>Project Metadata</Typography.Title>
                            <DisabledTag disabledAt={project.data?.deletedAt} />
                        </div>
                        <Space>
                            <Link to='/projects/$id/checkin' params={{ id: id }}>
                                <Button type='primary'>Check in</Button>
                            </Link>
                            <UndisableProjectModal>
                                {({ handleOpen: openUndisable }) => (
                                    <DisableProjectModal>
                                        {({ handleOpen: openDisable }) => (
                                            <UpdateProjectModal>
                                                {({ handleOpen: openUpdate }) => (
                                                    <Dropdown.Button
                                                        menu={{
                                                            items: [
                                                                CopyToClipboardMenuItem(id),
                                                                project.data.deletedAt === null
                                                                    ? {
                                                                          key: 'disable-project',
                                                                          label: 'Disable',
                                                                          danger: true,
                                                                          icon: <LockOutlined />,
                                                                          onClick: () => openDisable(id),
                                                                      }
                                                                    : {
                                                                          key: 'undisable-project',
                                                                          label: 'Re-enable',
                                                                          icon: <UnlockOutlined />,
                                                                          onClick: () => openUndisable(id),
                                                                      },
                                                            ],
                                                        }}
                                                        onClick={() => openUpdate(id)}
                                                    >
                                                        Update
                                                    </Dropdown.Button>
                                                )}
                                            </UpdateProjectModal>
                                        )}
                                    </DisableProjectModal>
                                )}
                            </UndisableProjectModal>
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
                                key: 'projectDetails-createdAt',
                                label: 'Creation Time',
                                children: project.data.createdAt.format('YYYY-MM-DD, HH:mm:ss'),
                            },
                            {
                                key: 'projectDetails-updatedAt',
                                label: 'Last Updated',
                                children: project.data.updatedAt.format('YYYY-MM-DD, HH:mm:ss'),
                            },
                            {
                                key: 'projectDetails-projectName',
                                label: 'Name',
                                children: project.data.projectName,
                            },
                            {
                                key: 'projectDetails-startDate',
                                label: 'Start Date',
                                children: project.data.startDate.format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                key: 'projectDetails-endDate',
                                label: 'End Date',
                                children: project.data.endDate.format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                key: 'projectDetails-duration',
                                label: 'Duration',
                                children: project.data.endDate.diff(project.data.startDate, 'days') + ' day(s)',
                            },
                        ]}
                    />
                    <ContentWrapper.ContentCard
                        useCard
                        cardProps={{
                            title: 'Description',
                            style: {
                                marginTop: '15px',
                            },
                        }}
                    >
                        <Typography.Paragraph>{project.data.description}</Typography.Paragraph>
                    </ContentWrapper.ContentCard>
                </>
            )}
            <Tabs
                defaultActiveKey={tab}
                style={{
                    marginTop: 25,
                }}
                type='card'
                tabBarStyle={{
                    margin: 0,
                }}
                onTabClick={(key: string) => {
                    navigate({
                        search: () => ({
                            tab: key,
                        }),
                    })
                }}
                tabBarExtraContent={
                    <RefreshButton
                        queryKey={(function () {
                            switch (tab) {
                                case ProjectIdTabs.TICKETS:
                                    return ticketsQueryKeys.GetAllByProjectId(id)
                                case ProjectIdTabs.VOUCHERS:
                                    return ticketVoucherQueryKeys.GetAllByProjectId(id)
                                case ProjectIdTabs.ORDERS:
                                    return ticketOrdersQueryKeys.GetAllByProjectId(id)
                                default:
                                    return []
                            }
                        })()}
                    />
                }
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: ProjectIdTabs.TICKETS,
                        key: ProjectIdTabs.TICKETS,
                        label: 'Tickets',
                        children: <TicketsListView />,
                    },
                    {
                        key: ProjectIdTabs.VOUCHERS,
                        tabKey: ProjectIdTabs.VOUCHERS,
                        label: 'Vouchers',
                        children: <VouchersListView />,
                    },
                    {
                        key: ProjectIdTabs.ORDERS,
                        tabKey: ProjectIdTabs.ORDERS,
                        label: 'Orders',
                        children: <OrdersListView />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}

function TicketsListView() {
    const projectId = Route.useParams({ select: (data) => data.id })
    const navigate = useNavigate()
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.ticketsLimit ?? 7,
            page: data.ticketsPage ?? 1,
        }),
    })
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAllByProjectId(projectId),
        queryFn: () => Tickets_GetAllByProjectId({ projectId }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <CreateOrUpdateTicketModal>
            {({ handleOpenCreate, handleOpenUpdate }) => (
                <ContentWrapper.ContentCard
                    useCard
                    cardProps={{
                        title: 'Tickets',
                        extra: (
                            <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenCreate(projectId)}>
                                Create
                            </Button>
                        ),
                        style: {
                            borderTopLeftRadius: 0,
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
                        appendActions={(record) => [
                            {
                                key: 'update-ticket',
                                label: 'Update',
                                icon: <EditOutlined />,
                                onClick: () => handleOpenUpdate(record.id),
                            },
                            {
                                key: 'delete-ticket',
                                label: 'Delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => {},
                            },
                        ]}
                        tableProps={{
                            pagination: {
                                onChange(page, pageSize) {
                                    navigate({
                                        search: (search) => {
                                            return {
                                                ...search,
                                                ticketsPage: page,
                                                ticketsLimit: pageSize,
                                            }
                                        },
                                    })
                                },
                                onShowSizeChange(page, pageSize) {
                                    navigate({
                                        search: (search) => {
                                            return {
                                                ...search,
                                                ticketsPage: page,
                                                ticketsLimit: pageSize,
                                            }
                                        },
                                    })
                                },
                            },
                        }}
                    />
                </ContentWrapper.ContentCard>
            )}
        </CreateOrUpdateTicketModal>
    )
}

function VouchersListView() {
    const projectId = Route.useParams({ select: (data) => data.id })
    const vouchers = useQuery({
        queryKey: ticketVoucherQueryKeys.GetAllByProjectId(projectId),
        queryFn: () => TicketVoucher_GetAllByProjectId({ projectId }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.vouchersLimit ?? 7,
            page: data.vouchersPage ?? 1,
        }),
    })
    const navigate = useNavigate()

    return (
        <CreateOrUpdateVoucherModal>
            {({ handleOpenCreate, handleOpenUpdate }) => (
                <ContentWrapper.ContentCard
                    useCard
                    cardProps={{
                        title: 'Vouchers',
                        extra: (
                            <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenCreate(projectId)}>
                                Create
                            </Button>
                        ),
                        style: {
                            borderTopLeftRadius: 0,
                        },
                    }}
                >
                    {vouchers.isError && 'PLACEHOLDER FOR ERROR'}
                    <BaseVouchersTable
                        isLoading={vouchers.isLoading}
                        data={vouchers.data}
                        limit={limit}
                        page={page}
                        tableWrapperProps={{
                            style: {
                                padding: 0,
                            },
                        }}
                        appendActions={(record) => [
                            {
                                key: 'update-voucher',
                                label: 'Update',
                                icon: <EditOutlined />,
                                onClick: () => handleOpenUpdate(record.id),
                            },
                            {
                                key: 'delete-voucher',
                                label: 'Delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => {},
                            },
                        ]}
                        tableProps={{
                            pagination: {
                                onChange(page, pageSize) {
                                    navigate({
                                        search: (search) => {
                                            return {
                                                ...search,
                                                vouchersPage: page,
                                                vouchersLimit: pageSize,
                                            }
                                        },
                                    })
                                },
                                onShowSizeChange(page, pageSize) {
                                    navigate({
                                        search: (search) => {
                                            return {
                                                ...search,
                                                vouchersPage: page,
                                                vouchersLimit: pageSize,
                                            }
                                        },
                                    })
                                },
                            },
                        }}
                    />
                </ContentWrapper.ContentCard>
            )}
        </CreateOrUpdateVoucherModal>
    )
}

function OrdersListView() {
    const projectId = Route.useParams({ select: (data) => data.id })
    const ticketOrders = useQuery({
        queryKey: ticketOrdersQueryKeys.GetAllByProjectId(projectId),
        queryFn: () => TicketOrders_GetAllByProjectId({ projectId }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.ordersLimit ?? 7,
            page: data.ordersPage ?? 1,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper.ContentCard
            useCard
            cardProps={{
                title: 'Ticket Orders',
                style: {
                    borderTopLeftRadius: 0,
                },
            }}
        >
            {ticketOrders.isError && 'PLACEHOLDER FOR ERROR'}
            <BaseTicketOrdersTable
                isLoading={ticketOrders.isLoading}
                data={ticketOrders.data}
                limit={limit}
                page={page}
                tableWrapperProps={{
                    style: {
                        padding: 0,
                    },
                }}
                tableProps={{
                    pagination: {
                        onChange(page, pageSize) {
                            navigate({
                                search: (search) => {
                                    return {
                                        ...search,
                                        ordersPage: page,
                                        ordersLimit: pageSize,
                                    }
                                },
                            })
                        },
                        onShowSizeChange(page, pageSize) {
                            navigate({
                                search: (search) => {
                                    return {
                                        ...search,
                                        ordersPage: page,
                                        ordersLimit: pageSize,
                                    }
                                },
                            })
                        },
                    },
                }}
            />
        </ContentWrapper.ContentCard>
    )
}
