import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetAllByProjectId } from '@/api/tickets/voucher/TicketVoucher_GetAllByProjectId'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import RefreshButton from '@/common/components/ReloadButton'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import UpdateProjectModal from '@/routes/_dashboard-layout/projects/-modals/UpdateProjectModal'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import CreateTicketModal from '@/routes/_dashboard-layout/tickets/-modals/CreateTicketModal'
import UpdateTicketModal from '@/routes/_dashboard-layout/tickets/-modals/UpdateTicketModel'
import BaseVouchersTable from '@/routes/_dashboard-layout/vouchers/-base/BaseVouchersTable'
import CreateOrUpdateVoucherModal from '@/routes/_dashboard-layout/vouchers/-modals/CreateOrUpdateVoucherModal'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { Button, Descriptions, Dropdown, Flex, Grid, Space, Tabs, Typography } from 'antd'
import { z } from 'zod'

enum Tab {
    TICKETS = 'tickets',
    VOUCHERS = 'vouchers',
}

export const Route = createFileRoute('/_dashboard-layout/projects/$id')({
    component: ProjectDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    validateSearch: z.object({
        ticketsPage: z.number().min(1).optional(),
        ticketsLimit: z.number().min(1).optional(),
        vouchersPage: z.number().min(1).optional(),
        vouchersLimit: z.number().min(1).optional(),
        tab: z.nativeEnum(Tab).optional(),
    }),
    loader: async ({ context: { queryClient }, params: { id } }) => {
        queryClient
            .prefetchQuery({
                queryKey: projectQueryKeys.GetById(id),
                queryFn: () => Project_GetById({ id }),
            })
            .catch((error) => {
                if (error instanceof ResourceNotFoundError) {
                    throw notFound({
                        routeId: Route.id,
                    })
                }

                throw error
            })
        queryClient.prefetchQuery({
            queryKey: ticketsQueryKeys.GetAllByProjectId(id),
            queryFn: () => Tickets_GetAllByProjectId({ projectId: id }),
        })
        queryClient.prefetchQuery({
            queryKey: ticketVoucherQueryKeys.GetAllByProjectId(id),
            queryFn: () => TicketVoucher_GetAllByProjectId({ projectId: id }),
        })
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function ProjectDetails() {
    const id = Route.useParams({ select: (data) => data.id })
    const project = useQuery({
        queryKey: projectQueryKeys.GetById(id),
        queryFn: () => Project_GetById({ id }),
        select: (res) => res.data,
    })
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint()
    const tab = Route.useSearch({ select: (data) => data.tab ?? Tab.TICKETS })

    return (
        <ContentWrapper
            headTitle={'Project Details'}
            title='Project Details'
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
                    paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
                    marginBottom: '25px',
                }}
            >
                <Typography.Title level={4}>Project Metadata</Typography.Title>
                <Space>
                    <UpdateProjectModal>
                        {({ handleOpen }) => (
                            <Dropdown.Button
                                menu={{
                                    items: [
                                        {
                                            key: 'delete-account',
                                            label: 'Delete',
                                            danger: true,
                                            icon: <DeleteOutlined />,
                                        },
                                    ],
                                }}
                                onClick={() => handleOpen(id)}
                            >
                                Update
                            </Dropdown.Button>
                        )}
                    </UpdateProjectModal>
                </Space>
            </Flex>
            {project.isLoading && <ContentWrapper.LoadingCard />}
            {project.isSuccess && (
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
                        queryKey={
                            tab === Tab.TICKETS ? ticketsQueryKeys.GetAllByProjectId(id) : ticketVoucherQueryKeys.GetAllByProjectId(id)
                        }
                    />
                }
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: Tab.TICKETS,
                        key: Tab.TICKETS,
                        label: 'Tickets',
                        children: <TicketsListView />,
                    },
                    {
                        key: Tab.VOUCHERS,
                        tabKey: Tab.VOUCHERS,
                        label: 'Vouchers',
                        children: <VouchersListView />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}

function TicketsListView() {
    const id = Route.useParams({ select: (data) => data.id })
    const navigate = useNavigate()
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.ticketsLimit ?? 7,
            page: data.ticketsPage ?? 1,
        }),
    })
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAllByProjectId(id),
        queryFn: () => Tickets_GetAllByProjectId({ projectId: id }),
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
                extra: (
                    <CreateTicketModal>
                        {({ handleOpen }) => (
                            <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpen(id)}>
                                Create
                            </Button>
                        )}
                    </CreateTicketModal>
                ),
                style: {
                    borderTopLeftRadius: 0,
                },
            }}
        >
            {tickets.isError && 'PLACEHOLDER FOR ERROR'}
            <UpdateTicketModal>
                {({ handleOpen }) => (
                    <TicketsTable
                        isLoading={tickets.isLoading}
                        tickets={tickets.data}
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
                                onClick: () => handleOpen(record.id),
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
                )}
            </UpdateTicketModal>
        </ContentWrapper.ContentCard>
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
                        vouchers={vouchers.data}
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
