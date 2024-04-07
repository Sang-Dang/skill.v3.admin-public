import { projectQueryKeys } from '@/api/projects/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import DisabledProjectsTable from '@/routes/_dashboard-layout/projects/-components/DisabledProjectsTable'
import { ProjectDisabledTabs } from '@/routes/_dashboard-layout/projects/-utils/ProjectDisabledTabs.enum'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/projects/disabled')({
    component: DisabledProjectsList,
})

function DisabledProjectsList() {
    const search = Route.useSearch({
        select: (data) => ({ page: data.page || 1, limit: data.limit || 7, tab: data.tab || ProjectDisabledTabs.ALL }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Disabled Projects'
            title='Disabled Projects'
            breadcrumbs={[DashboardBreadcrumbs.static.index, ProjectBreadcrumbs.static.index, ProjectBreadcrumbs.static.disabled]}
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
                tabBarExtraContent={<RefreshButton queryKey={projectQueryKeys.GetAllDisabled()} />}
                destroyInactiveTabPane
                items={[
                    {
                        tabKey: ProjectDisabledTabs.ALL,
                        key: ProjectDisabledTabs.ALL,
                        label: 'All',
                        children: <DisabledProjectsTable limit={search.limit} page={search.page} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
