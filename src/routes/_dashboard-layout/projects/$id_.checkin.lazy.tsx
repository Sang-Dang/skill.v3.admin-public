import ContentWrapper from '@/common/components/ContentWrapper'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard-layout/projects/$id/checkin')({
    component: CheckinPage,
})

function CheckinPage() {
    const id = Route.useParams({ select: (params) => params.id })

    return (
        <ContentWrapper
            headTitle={'Check In'}
            title='Check In'
            breadcrumbs={[
                DashboardBreadcrumbs.static.index,
                ProjectBreadcrumbs.static.index,
                ProjectBreadcrumbs.dynamic.$id(id, false),
                ProjectBreadcrumbs.dynamic.checkin(id),
            ]}
            innerStyle={{
                marginBlock: '25px',
            }}
        >
            Test
        </ContentWrapper>
    )
}
