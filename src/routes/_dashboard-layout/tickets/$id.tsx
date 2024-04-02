import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import { NotFoundError } from '@/lib/errors/NotFoundError'
import DeleteAccountModal from '@/routes/_dashboard-layout/accounts/-modals/DeleteAccountModal'
import { DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Await, createFileRoute, defer, Link, notFound } from '@tanstack/react-router'
import { Button, Card, Descriptions, Dropdown, Flex, Space, Typography } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/tickets/$id')({
    component: TicketDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        const data = queryClient
            .ensureQueryData({
                queryKey: ticketsQueryKeys.GetById(id),
                queryFn: () => Tickets_GetById({ id }),
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
            ticket: defer(data),
        }
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function TicketDetails() {
    const ticket = Route.useLoaderData({ select: (res) => res.ticket })

    return (
        <ContentWrapper
            headTitle={'Ticket Details'}
            title='Ticket Details'
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
            <Await promise={ticket} fallback={<Card loading />}>
                {function TicketView(ticket) {
                    const project = useQuery({
                        queryKey: projectQueryKeys.GetById(ticket.data.project),
                        queryFn: () => Project_GetById({ id: ticket.data.project }),
                        select: (res) => res.data,
                    })

                    return (
                        <>
                            <Flex
                                justify='space-between'
                                style={{
                                    marginBottom: '25px',
                                }}
                            >
                                <Typography.Title level={4}>Ticket Metadata</Typography.Title>
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
                                                            onClick: () => handleOpen(ticket.data.id),
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
                                column={2}
                                items={[
                                    {
                                        key: 'ticketDetails-createdAt',
                                        label: 'Creation Time',
                                        children: ticket.data.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketDetails-updatedAt',
                                        label: 'Last Updated',
                                        children: ticket.data.updatedAt.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketDetails-ticketName',
                                        label: 'Ticket Name',
                                        children: ticket.data.ticketName,
                                    },
                                    {
                                        key: 'ticketDetails-price',
                                        label: 'Price',
                                        children: ticket.data.price.toLocaleString() + ' VND',
                                    },
                                    {
                                        key: 'ticketDetails-quantity',
                                        label: 'Quantity',
                                        children: ticket.data.quantity.toLocaleString(),
                                    },
                                    {
                                        key: 'ticketDetails-startDate',
                                        label: 'Start Date',
                                        children: ticket.data.startDate.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketDetails-endDate',
                                        label: 'End Date',
                                        children: ticket.data.endDate.format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    {
                                        key: 'ticketDetails-project',
                                        label: 'Project',
                                        children: (
                                            <Link to={'/projects/$id'} params={{ id: ticket.data.project }}>
                                                <Button type='link' loading={project.isLoading} style={{ padding: 0, lineHeight: 0 }}>
                                                    {project.data?.projectName}
                                                </Button>
                                            </Link>
                                        ),
                                    },
                                ]}
                            />
                            <ContentWrapper.ContentCard
                                useCard
                                cardProps={{
                                    title: 'Description',
                                }}
                            >
                                <Typography.Paragraph>{ticket.data.description}</Typography.Paragraph>
                            </ContentWrapper.ContentCard>
                        </>
                    )
                }}
            </Await>
        </ContentWrapper>
    )
}
