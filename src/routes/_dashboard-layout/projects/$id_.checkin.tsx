import ContentWrapper from '@/common/components/ContentWrapper'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/projects/$id/checkin')({
    component: CheckinPage,
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
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
