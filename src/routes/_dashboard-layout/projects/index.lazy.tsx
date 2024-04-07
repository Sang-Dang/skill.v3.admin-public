import { projectQueryKeys } from '@/api/projects/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { ProjectStatus } from '@/lib/enum/project-status.enum'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import ProjectsByStatusTable from '@/routes/_dashboard-layout/projects/-components/ProjectsByStatusTable'
import { ProjectIndexTabs } from '@/routes/_dashboard-layout/projects/-utils/ProjectIndexTabs.enum'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/projects/')({
    component: ProjectsComponent,
})

function ProjectsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            page: data.page || 1,
            limit: data.limit || 7,
            tab: data.tab || ProjectIndexTabs.RUNNING,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Projects List'
            title='Projects List'
            breadcrumbs={[DashboardBreadcrumbs.static.index, ProjectBreadcrumbs.static.index]}
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
                tabBarExtraContent={<RefreshButton queryKey={projectQueryKeys.GetAll()} />}
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: ProjectIndexTabs.RUNNING,
                        key: ProjectIndexTabs.RUNNING,
                        label: 'Running',
                        children: <ProjectsByStatusTable status={ProjectStatus.RUNNING} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: ProjectIndexTabs.FUTURE,
                        tabKey: ProjectIndexTabs.FUTURE,
                        label: 'Future',
                        children: <ProjectsByStatusTable status={ProjectStatus.FUTURE} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: ProjectIndexTabs.ARCHIVED,
                        tabKey: ProjectIndexTabs.ARCHIVED,
                        label: 'Archived',
                        children: <ProjectsByStatusTable status={ProjectStatus.ARCHIVED} page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
