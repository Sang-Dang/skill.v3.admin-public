import ContentWrapper from '@/common/components/ContentWrapper'
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
        page: z.number().min(1).optional().default(1),
        limit: z.number().min(1).optional().default(7),
        tab: z.nativeEnum(Tab).optional().default(Tab.RUNNING),
    }),
})

function ProjectsComponent() {
    const search = Route.useSearch()
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
                            page: undefined,
                            limit: undefined,
                            tab: key,
                        },
                    })
                }}
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
