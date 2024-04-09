import { CheckIn_GetFullOrdersByOrderId } from '@/api/tickets/checkin/CheckIn_GetFullOrdersByProjectId'
import { ticketCheckInQueryKeys } from '@/api/tickets/checkin/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import CheckInModal from '@/routes/_dashboard-layout/projects/-modals/CheckInModal'
import OrdersTableWithCheckedIn from '@/routes/_dashboard-layout/tickets/orders/-base/OrdersTableWithCheckedIn'
import { QrcodeOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Card, Divider, Space, Statistic } from 'antd'
import { useMemo } from 'react'

export const Route = createLazyFileRoute('/_dashboard-layout/projects/$id/checkin')({
    component: CheckinPage,
})

function CheckinPage() {
    const id = Route.useParams({ select: (params) => params.id })
    const search = Route.useSearch({
        select: (data) => ({
            page: data.page || 1,
            limit: data.limit || 7,
        }),
    })
    const orders = useQuery({
        queryKey: ticketCheckInQueryKeys.GetFullOrdersByProjectId(id),
        queryFn: () => CheckIn_GetFullOrdersByOrderId({ projectId: id }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    const ticketsStats = useMemo(() => {
        if (!orders.isSuccess) return undefined

        const allOrderItems = orders.data.list.map((order) => order.items).flat()
        const allTickets = allOrderItems.reduce((prev, curr) => prev + curr.quantity, 0)
        const allCheckedIn = allOrderItems.reduce((prev, curr) => prev + curr.checkedIn, 0)

        return {
            allTickets,
            allCheckedIn,
        }
    }, [orders.data, orders.isSuccess])

    return (
        <ContentWrapper
            headTitle={'Check In'}
            title='Check In'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                ProjectBreadcrumbs.static.index,
                ProjectBreadcrumbs.dynamic.$id(id, false),
                ProjectBreadcrumbs.dynamic.checkin(id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            <div className='grid grid-cols-1 gap-0 px-4 xs:px-0 xl:grid-cols-9 xl:gap-5'>
                <Card className='col-span-8 rounded-b-none border-none xl:rounded-md'>
                    <Space split={<Divider type='vertical' />}>
                        <Statistic title='Orders' value={orders.data?.total} />
                        <Statistic title='Tickets' value={ticketsStats?.allTickets} />
                        <Statistic title='Checked In' value={ticketsStats?.allCheckedIn} />
                    </Space>
                </Card>
                <CheckInModal>
                    {({ handleOpen }) => (
                        <button
                            type='button'
                            className='group flex cursor-pointer items-center justify-center gap-3 rounded-b-md rounded-t-none border-none bg-blue-500 px-2 py-3 text-xs font-semibold text-white  shadow-md ring-1 ring-inset ring-gray-300 transition-all hover:bg-blue-400 xl:flex-col xl:gap-1 xl:rounded-md'
                            onClick={handleOpen}
                        >
                            <QrcodeOutlined className='text-3xl xl:text-5xl' />
                            <div className='font-mono text-base uppercase'>Scan QR</div>
                        </button>
                    )}
                </CheckInModal>
            </div>
            <OrdersTableWithCheckedIn data={orders.data} isLoading={orders.isLoading} limit={search.limit} page={search.page} />
        </ContentWrapper>
    )
}
