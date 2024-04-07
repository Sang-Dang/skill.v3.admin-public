import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import { TicketOrders_GetById } from '@/api/tickets/orders/TicketOrders_GetById'
import { Role } from '@/lib/enum/role.enum'
import { TicketOrderIdTabs } from '@/routes/_dashboard-layout/tickets/orders/-utils/TicketOrderIdTabs.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/tickets/orders/$id')({
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    validateSearch: z.object({
        tab: z.nativeEnum(TicketOrderIdTabs).optional(),
        OIPage: z.number().min(1).optional(),
        OILimit: z.number().min(1).optional(),
        TPage: z.number().min(1).optional(),
        TLimit: z.number().min(1).optional(),
    }),
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: ticketOrdersQueryKeys.GetById(id),
            queryFn: () => TicketOrders_GetById({ id }),
        })
    },
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
})
