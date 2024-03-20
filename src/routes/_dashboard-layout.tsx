import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute('/_dashboard-layout')({
    component: DashboardLayout
})

function DashboardLayout() {
    return <div>
        <h1>Dashboard</h1>
        <Outlet/>
    </div>
}