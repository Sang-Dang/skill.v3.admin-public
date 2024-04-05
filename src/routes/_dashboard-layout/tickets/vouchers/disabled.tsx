import { ticketsQueryKeys } from '@/api/tickets/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { Role } from '@/lib/enum/role.enum'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { TicketVouchersBreadcrumbs } from '@/routes/_dashboard-layout/tickets/vouchers/-breadcrumbs'
import DisabledVouchersTable from '@/routes/_dashboard-layout/tickets/vouchers/-components/DisabledVouchersTable'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'
import { z } from 'zod'

enum Tab {
    ALL = 'all',
}

export const Route = createFileRoute('/_dashboard-layout/tickets/vouchers/disabled')({
    component: TicketsComponent,
    beforeLoad: async ({ context: { authHandler }, location }) => {
        const response = await authHandler.authorize(Role.ADMIN)
        if (!response) {
            throw redirect({
                to: '/',
                search: {
                    error: "You don't have permission to access this page.",
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
        tab: z.nativeEnum(Tab).optional(),
    }),
})

export function TicketsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 7,
            page: data.page ?? 1,
            tab: data.tab ?? Tab.ALL,
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
                        key: Tab.ALL,
                        label: 'All',
                        children: <DisabledVouchersTable page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}

TicketsComponent.Tabs = Tab
