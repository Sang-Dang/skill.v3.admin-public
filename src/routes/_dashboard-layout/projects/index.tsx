import { projectQueryKeys } from '@/api/projects/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { ProjectStatus } from '@/lib/enum/project-status.enum'
import { Role } from '@/lib/enum/role.enum'
import ProjectsByStatusTable from '@/routes/_dashboard-layout/projects/-components/ProjectsByStatusTable'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'
import { z } from 'zod'

enum Tab {
    RUNNING = 'running',
    ARCHIVED = 'finished',
    FUTURE = 'future',
}

export const Route = createFileRoute('/_dashboard-layout/projects/')({
    component: ProjectsComponent,
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

function ProjectsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            page: data.page || 1,
            limit: data.limit || 7,
            tab: data.tab || Tab.RUNNING,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Projects List'
            title='Projects List'
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
                tabBarExtraContent={<RefreshButton queryKey={projectQueryKeys.GetAll()} />}
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: Tab.RUNNING,
                        key: Tab.RUNNING,
                        label: 'Running',
                        children: <ProjectsByStatusTable status={ProjectStatus.RUNNING} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Tab.FUTURE,
                        tabKey: Tab.FUTURE,
                        label: 'Future',
                        children: <ProjectsByStatusTable status={ProjectStatus.FUTURE} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Tab.ARCHIVED,
                        tabKey: Tab.ARCHIVED,
                        label: 'Archived',
                        children: <ProjectsByStatusTable status={ProjectStatus.ARCHIVED} page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
