import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetAllByProjectId } from '@/api/tickets/voucher/TicketVoucher_GetAllByProjectId'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { Role } from '@/lib/enum/role.enum'
import { ProjectIdTabs } from '@/routes/_dashboard-layout/projects/-utils/ProjectIdTabs.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/projects/$id')({
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    validateSearch: z.object({
        ticketsPage: z.number().min(1).optional(),
        ticketsLimit: z.number().min(1).optional(),
        vouchersPage: z.number().min(1).optional(),
        vouchersLimit: z.number().min(1).optional(),
        ordersPage: z.number().min(1).optional(),
        ordersLimit: z.number().min(1).optional(),
        tab: z.nativeEnum(ProjectIdTabs).optional(),
    }),
    loader: async ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: projectQueryKeys.GetById(id),
            queryFn: () => Project_GetById({ id }),
        })
        queryClient.prefetchQuery({
            queryKey: ticketsQueryKeys.GetAllByProjectId(id),
            queryFn: () => Tickets_GetAllByProjectId({ projectId: id }),
        })
        queryClient.prefetchQuery({
            queryKey: ticketVoucherQueryKeys.GetAllByProjectId(id),
            queryFn: () => TicketVoucher_GetAllByProjectId({ projectId: id }),
        })
    },
    notFoundComponent: () => <DetailsNotFound />,
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