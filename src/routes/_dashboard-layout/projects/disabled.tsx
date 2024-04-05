import { projectQueryKeys } from '@/api/projects/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { Role } from '@/lib/enum/role.enum'
import DisabledProjectsTable from '@/routes/_dashboard-layout/projects/-components/DisabledProjectsTable'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'
import { z } from 'zod'

enum Tab {
    ALL = 'all',
}

export const Route = createFileRoute('/_dashboard-layout/projects/disabled')({
    component: DisabledProjectsList,
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

function DisabledProjectsList() {
    const search = Route.useSearch({ select: (data) => ({ page: data.page || 1, limit: data.limit || 7, tab: data.tab || Tab.ALL }) })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Disabled Projects'
            title='Disabled Projects'
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
                            ticketsPage: undefined,
                            ticketsLimit: undefined,
                            tab: key,
                        },
                    })
                }}
                tabBarExtraContent={<RefreshButton queryKey={projectQueryKeys.GetAllDisabled()} />}
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: Tab.ALL,
                        key: Tab.ALL,
                        label: 'All',
                        children: <DisabledProjectsTable limit={search.limit} page={search.page} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
