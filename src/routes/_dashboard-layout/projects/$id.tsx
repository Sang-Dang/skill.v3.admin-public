import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import { NotFoundError } from '@/lib/errors/NotFoundError'
import DeleteAccountModal from '@/routes/_dashboard-layout/accounts/-modals/DeleteAccountModal'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import { DeleteOutlined } from '@ant-design/icons'
import { Await, createFileRoute, defer, notFound, Outlet } from '@tanstack/react-router'
import { Card, Descriptions, Dropdown, Flex, Space, Spin, Typography } from 'antd'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/projects/$id')({
    component: ProjectDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
    }),
    loader: async ({ context: { queryClient }, params: { id } }) => {
        const project = queryClient
            .ensureQueryData({
                queryKey: projectQueryKeys.GetById(id),
                queryFn: () => Project_GetById({ id }),
            })
            .catch((error) => {
                if (error instanceof NotFoundError) {
                    throw notFound({
                        routeId: Route.id,
                    })
                }

                throw error
            })
        const tickets = queryClient.ensureQueryData({
            queryKey: ticketsQueryKeys.GetByProjectId(id),
            queryFn: () => Tickets_GetAllByProjectId({ projectId: id }),
        })

        return {
            projects: defer(project),
            tickets: defer(tickets),
        }
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function ProjectDetails() {
    const id = Route.useParams({ select: (data) => data.id })
    const project = Route.useLoaderData({ select: (res) => res.projects })
    const tickets = Route.useLoaderData({ select: (res) => res.tickets })
    const { page, limit } = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
        }),
    })

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
            <Outlet />
            <Await promise={project} fallback={<Card loading />}>
                {(project) => {
                    return (
                        <>
                            <Flex
                                justify='space-between'
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                <Typography.Title level={4}>Project Metadata</Typography.Title>
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
                            <Descriptions
                                column={{
                                    xs: 1,
                                    sm: 2,
                                }}
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
                                        label: 'Project Name',
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
                            <ContentWrapper.ContentCard
                                useCard
                                cardProps={{
                                    title: 'Tickets',
                                    style: {
                                        marginTop: '15px',
                                    },
                                }}
                            >
                                <Await promise={tickets} fallback={<Spin fullscreen />}>
                                    {(tickets) => {
                                        const processedData = tickets.data.filter((ticket) => ticket.project === id)
                                        return (
                                            <TicketsTable
                                                isLoading={false}
                                                tickets={{
                                                    list: processedData,
                                                    total: processedData.length,
                                                }}
                                                page={page}
                                                limit={limit}
                                                tableWrapperProps={{
                                                    style: {
                                                        padding: 0,
                                                    },
                                                }}
                                                paginationWrapperProps={{
                                                    style: {
                                                        padding: 0,
                                                        marginTop: '15px',
                                                    },
                                                }}
                                            />
                                        )
                                    }}
                                </Await>
                            </ContentWrapper.ContentCard>
                        </>
                    )
                }}
            </Await>
        </ContentWrapper>
    )
}
