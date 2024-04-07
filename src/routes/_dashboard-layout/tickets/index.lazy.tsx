import { ticketsQueryKeys } from '@/api/tickets/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketBreadcrumbs } from '@/routes/_dashboard-layout/tickets/-breadcrumbs'
import AllTicketsTable from '@/routes/_dashboard-layout/tickets/-components/AllTicketsTable'
import { TicketsIndexTab } from '@/routes/_dashboard-layout/tickets/-utils/TicketIndexTabs.enum'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/')({
    component: TicketsComponent,
})

function TicketsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
            tab: data.tab ?? TicketsIndexTab.ALL,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Tickets List'
            title='Tickets List'
            breadcrumbs={[DashboardBreadcrumbs.static.index, TicketBreadcrumbs.static.index]}
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
                tabBarExtraContent={<RefreshButton queryKey={ticketsQueryKeys.GetAll()} />}
                items={[
                    {
                        key: TicketsIndexTab.ALL,
                        label: 'All',
                        children: <AllTicketsTable page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
