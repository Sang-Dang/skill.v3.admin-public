import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/tickets/$id')({
    beforeLoad: async ({ context: { authHandler }, location }) => {
        const response = await authHandler.authorize(Role.ADMIN)
        if (!response) {
            throw redirect({
                to: '/',
                search: {
                    error: "You don't have permission to access this page.",
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: ticketsQueryKeys.GetById(id),
            queryFn: () => Tickets_GetById({ id }),
        })
    },
})
