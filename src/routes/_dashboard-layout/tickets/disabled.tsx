import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/tickets/disabled')({
  component: () => <div>Hello /_dashboard-layout/tickets/disabled!</div>
})