import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'

export const ticketOrdersQueryKeys = {
    GetAll: () => ['ticket-orders'],
    GetAllByProjectId: (projectId: string) => ['ticket-orders', projectId],
    GetAllByEmail: (email: string) => ['ticket-orders', email],
    GetAllByTicketVoucher: (ticketVoucher: string) => ['ticket-orders', ticketVoucher],
    GetAllByStatus: (status: TicketOrderStatus) => ['ticket-orders', status],
    GetById: (id: string) => ['ticket-orders', id],
}
