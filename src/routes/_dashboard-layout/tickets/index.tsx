import { ticketsQueryKeys } from '@/api/tickets/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { Role } from '@/lib/enum/role.enum'
import AllTicketsTable from '@/routes/_dashboard-layout/tickets/-components/AllTicketsTable'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'
import { z } from 'zod'

enum Tab {
    ALL = 'all',
}

export const Route = createFileRoute('/_dashboard-layout/tickets/')({
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
            headTitle='Tickets List'
            title='Tickets List'
            breadcrumbs={[
                {
                    breadcrumbName: 'Home',
                    title: 'Home',
                    href: '/',
                    key: 'home',
                },
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
                            page: undefined,
                            limit: undefined,
                            tab: key,
                        },
                    })
                }}
                tabBarExtraContent={<RefreshButton queryKey={ticketsQueryKeys.GetAll()} />}
                items={[
                    {
                        key: Tab.ALL,
                        label: 'All',
                        children: <AllTicketsTable page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}

TicketsComponent.Tabs = Tab
