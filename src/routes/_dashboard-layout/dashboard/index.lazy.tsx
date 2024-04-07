import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard-layout/dashboard/')({
    component: DashboardComponent,
})

function DashboardComponent() {
    return (
        <div>
            <h1>HELLO HERE</h1>
        </div>
    )
}
