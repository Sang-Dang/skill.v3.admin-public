import { Role } from '@/lib/enum/role.enum'
import { TicketVoucherDisabledTabs } from '@/routes/_dashboard-layout/tickets/vouchers/-utils/TicketVoucherDisabledTabs.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/tickets/vouchers/disabled')({
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
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
        tab: z.nativeEnum(TicketVoucherDisabledTabs).optional(),
    }),
})
