import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard-layout/tickets/orders/create')({
    component: () => <div>Hello /_dashboard-layout/tickets/orders/create!</div>,
})
