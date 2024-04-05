import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { TicketVoucherStatus } from '@/lib/enum/ticket-status.enum'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketVouchersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/vouchers/-breadcrumbs'
import VouchersByStatusTable from '@/routes/_dashboard-layout/tickets/vouchers/-components/VouchersByStatusTable'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'
import { z } from 'zod'

enum Tab {
    RUNNING = 'running',
    ARCHIVED = 'finished',
    FUTURE = 'future',
}

export const Route = createFileRoute('/_dashboard-layout/tickets/vouchers/')({
    component: VouchersList,
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
        tab: z.nativeEnum(Tab).optional(),
    }),
})

function VouchersList() {
    const search = Route.useSearch({
        select: (data) => ({
            page: data.page ?? 1,
            limit: data.limit ?? 8,
            tab: data.tab ?? Tab.RUNNING,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Vouchers List'
            title='Vouchers List'
            breadcrumbs={[DashboardBreadcrumbs.static.index, TicketVouchersBreadcrumbs.static.index]}
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
                tabBarExtraContent={<RefreshButton queryKey={ticketVoucherQueryKeys.GetAll()} />}
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: Tab.RUNNING,
                        key: Tab.RUNNING,
                        label: 'Running',
                        children: <VouchersByStatusTable status={TicketVoucherStatus.RUNNING} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Tab.FUTURE,
                        tabKey: Tab.FUTURE,
                        label: 'Future',
                        children: <VouchersByStatusTable status={TicketVoucherStatus.FUTURE} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Tab.ARCHIVED,
                        tabKey: Tab.ARCHIVED,
                        label: 'Archived',
                        children: <VouchersByStatusTable status={TicketVoucherStatus.ARCHIVED} page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
