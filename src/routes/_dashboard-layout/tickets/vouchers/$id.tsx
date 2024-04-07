import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetById } from '@/api/tickets/voucher/TicketVoucher_GetById'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/tickets/vouchers/$id')({
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
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
    }),
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: ticketVoucherQueryKeys.GetById(id),
            queryFn: () => TicketVoucher_GetById({ id }),
        })
    },
    notFoundComponent: () => <DetailsNotFound />,
})
