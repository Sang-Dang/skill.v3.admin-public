import { TicketVoucherStatus } from '@/lib/enum/ticket-status.enum'

export const ticketVoucherQueryKeys = {
    GetAll: () => ['ticket-voucher'],
    GetAllByStatus: (status: TicketVoucherStatus) => ['ticket-voucher', status],
    GetAllByProjectId: (projectId: string) => ['ticket-voucher', projectId],
    GetById: (id: string) => ['ticket-voucher', id],
}
