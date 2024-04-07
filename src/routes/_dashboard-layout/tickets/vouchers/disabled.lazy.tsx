import { ticketsQueryKeys } from '@/api/tickets/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketVouchersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/vouchers/-breadcrumbs'
import DisabledVouchersTable from '@/routes/_dashboard-layout/tickets/vouchers/-components/DisabledVouchersTable'
import { TicketVoucherDisabledTabs } from '@/routes/_dashboard-layout/tickets/vouchers/-utils/TicketVoucherDisabledTabs.enum'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/vouchers/disabled')({
    component: TicketsComponent,
})

function TicketsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
            tab: data.tab ?? TicketVoucherDisabledTabs.ALL,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Disabled Vouchers'
            title='Disabled Vouchers'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                TicketVouchersBreadcrumbs.static.index,
                TicketVouchersBreadcrumbs.static.disabled,
            ]}
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
                        key: TicketVoucherDisabledTabs.ALL,
                        label: 'All',
                        children: <DisabledVouchersTable page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
