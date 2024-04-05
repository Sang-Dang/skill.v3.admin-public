import { File_GetImage_Url } from '@/api/file/File_GetImage_Url'
import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import ContentWrapper from '@/common/components/ContentWrapper'
import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import DisabledTag from '@/common/components/DisabledTag'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketBreadcrumbs } from '@/routes/_dashboard-layout/tickets/-breadcrumbs'
import CreateOrUpdateTicketModal from '@/routes/_dashboard-layout/tickets/-modals/CreateOrUpdateTicketModal'
import DisableTicketModal from '@/routes/_dashboard-layout/tickets/-modals/DisableTicketModal'
import UndisableTicketModal from '@/routes/_dashboard-layout/tickets/-modals/UndisableTicketModal'
import { FileImageFilled, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Descriptions, Dropdown, Flex, Grid, Image, Skeleton, Space, Typography } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/tickets/$id')({
    component: TicketDetails,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: ticketsQueryKeys.GetById(id),
            queryFn: () => Tickets_GetById({ id }),
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
                DashboardBreadcrumbs.static.index,
                TicketBreadcrumbs.static.index,
                TicketBreadcrumbs.dynamic.$id(project.data?.id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            {ticket.isSuccess && (
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
                            <Typography.Title level={4}>Ticket Metadata</Typography.Title>
                            <DisabledTag disabledAt={ticket.data.deletedAt} />
                        </div>
                        <Space>
                            <CreateOrUpdateTicketModal>
                                {({ handleOpenUpdate }) => (
                                    <UndisableTicketModal>
                                        {({ handleOpen: handleUndisable }) => (
                                            <DisableTicketModal>
                                                {({ handleOpen: openDisable }) => (
                                                    <Dropdown.Button
                                                        onClick={() => handleOpenUpdate(id)}
                                                        menu={{
                                                            items: [
                                                                CopyToClipboardMenuItem(id),
                                                                ticket.data.deletedAt !== null
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
                                            </DisableTicketModal>
                                        )}
                                    </UndisableTicketModal>
                                )}
                            </CreateOrUpdateTicketModal>
                        </Space>
                    </Flex>
                    <div className='grid grid-cols-1 gap-5 sm:grid-cols-6'>
                        <div className='col-span-6'>
                            <Descriptions
                                column={{
                                    xs: 1,
                                    sm: 2,
                                    md: 2,
                                    lg: 2,
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
                        </div>
                        {/* <Image
                            key={'main image'}
                            src={File_GetImage_Url({ path: ticket.data.images[0] })}
                            alt='ticket-image'
                            className='size-full rounded-lg'
                        /> */}
                    </div>
                    <ContentWrapper.ContentCard
                        useCard
                        cardProps={{
                            title: 'Images',
                            style: {
                                marginTop: 20,
                            },
                        }}
                    >
                        <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6'>
                            {ticket.data.images.map((image, index) => (
                                <Image
                                    key={index}
                                    src={File_GetImage_Url({ path: image })}
                                    alt='ticket-image'
                                    className='size-full rounded-lg'
                                />
                            ))}
                            {new Array(6 - ticket.data.images.length).fill(null).map((_, index) => (
                                <div
                                    key={index + '-empty-image'}
                                    style={{
                                        border: '3px dashed #d9d9d9',
                                    }}
                                    className='flex size-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200'
                                >
                                    <FileImageFilled className='text-3xl' />
                                </div>
                            ))}
                        </div>
                    </ContentWrapper.ContentCard>
                </>
            )}
        </ContentWrapper>
    )
}
