import { ticketsQueryKeys } from '@/api/tickets/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketBreadcrumbs } from '@/routes/_dashboard-layout/tickets/-breadcrumbs'
import DisabledTicketsTable from '@/routes/_dashboard-layout/tickets/-components/DisabledTicketsTable'
import { TicketDisabledTabs } from '@/routes/_dashboard-layout/tickets/-utils/TicketDisabledTabs.enum'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/disabled')({
    component: TicketsComponent,
})

function TicketsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
            tab: data.tab ?? TicketDisabledTabs.ALL,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Disabled Tickets'
            title='Disabled Tickets'
            breadcrumbs={[DashboardBreadcrumbs.static.index, TicketBreadcrumbs.static.index, TicketBreadcrumbs.static.disabled]}
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
                            tab: key,
                            page: undefined,
                            limit: undefined,
                        },
                    })
                }}
                tabBarExtraContent={<RefreshButton queryKey={ticketsQueryKeys.GetAllDisabled()} />}
                items={[
                    {
                        key: TicketDisabledTabs.ALL,
                        label: 'All',
                        children: <DisabledTicketsTable page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
