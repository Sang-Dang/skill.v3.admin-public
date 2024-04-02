import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/dashboard/')({
    component: DashboardComponent,
})

function DashboardComponent() {
    return (
        <div>
            <h1>HELLO HERE</h1>
        </div>
    )
}
