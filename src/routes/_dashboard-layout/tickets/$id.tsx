import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import ContentWrapper from '@/common/components/ContentWrapper'
import DetailsNotFound from '@/common/components/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import DeleteAccountModal from '@/routes/_dashboard-layout/accounts/-modals/DeleteAccountModal'
import { DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Descriptions, Dropdown, Flex, Grid, Skeleton, Space, Typography } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/tickets/$id')({
    component: TicketDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient
            .prefetchQuery({
                queryKey: ticketsQueryKeys.GetById(id),
                queryFn: () => Tickets_GetById({ id }),
            })
            .catch((error) => {
                if (error instanceof ResourceNotFoundError) {
                    throw notFound({
                        routeId: Route.id,
                    })
                }

                throw error
            })
    },
    notFoundComponent: () => <DetailsNotFound />,
})

function TicketDetails() {
    const id = Route.useParams({ select: (params) => params.id })
    const screens = Grid.useBreakpoint()
    const ticket = useQuery({
        queryKey: ticketsQueryKeys.GetById(id),
        queryFn: () => Tickets_GetById({ id }),
        select: (data) => data.data,
    })
    const project = useQuery({
        queryKey: projectQueryKeys.GetFromTicket(ticket.data),
        queryFn: () => Project_GetById({ id: ticket.data!.project }),
        enabled: ticket.isSuccess,
        select: (res) => res.data,
    })

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
            <Flex
                justify='space-between'
                style={{
                    marginBottom: '25px',
                    paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : '0',
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
            {ticket.isSuccess && (
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
            )}
        </ContentWrapper>
    )
}
