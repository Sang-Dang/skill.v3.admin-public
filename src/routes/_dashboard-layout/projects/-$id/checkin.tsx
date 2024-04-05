import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/projects/$id/checkin')({
  component: () => <div>Hello /_dashboard-layout/projects/$id/checkin!</div>
})