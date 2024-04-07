import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketOrdersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/orders/-breadcrumbs'
import TicketOrderByStatusTable from '@/routes/_dashboard-layout/tickets/orders/-components/TicketOrderByStatusTable'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/orders/')({
    component: TicketOrdersList,
})

function TicketOrdersList() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
            tab: data.tab ?? TicketOrderStatus.PAID,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Ticket Orders'
            title='Ticket Orders'
            breadcrumbs={[DashboardBreadcrumbs.static.index, TicketOrdersBreadcrumbs.static.index]}
        >
            <Tabs
                defaultActiveKey={search.tab}
                style={{
                    marginTop: 25,
                }}
                type='card'
                tabBarStyle={{
                    margin: 0,
                }}
                onTabClick={(key: string) => {
                    navigate({
                        search: {
                            page: undefined,
                            limit: undefined,
                            tab: key,
                        },
                    })
                }}
                tabBarExtraContent={<RefreshButton queryKey={ticketOrdersQueryKeys.GetAll()} />}
                items={[
                    {
                        key: TicketOrderStatus.PAID,
                        label: 'Paid',
                        children: <TicketOrderByStatusTable limit={search.limit} page={search.page} status={TicketOrderStatus.PAID} />,
                    },
                    {
                        key: TicketOrderStatus.PENDING,
                        label: 'Pending',
                        children: <TicketOrderByStatusTable limit={search.limit} page={search.page} status={TicketOrderStatus.PENDING} />,
                    },
                    {
                        key: TicketOrderStatus.EXPIRED,
                        label: 'Expired',
                        children: <TicketOrderByStatusTable limit={search.limit} page={search.page} status={TicketOrderStatus.EXPIRED} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
