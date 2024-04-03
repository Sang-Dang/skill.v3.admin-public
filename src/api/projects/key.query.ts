import { ProjectStatus } from '@/lib/enum/project-status.enum'
import { TicketModel } from '@/lib/model/ticket.model'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'

export const projectQueryKeys = {
    GetAll: () => ['projects'],
    GetAllByStatus: (status: ProjectStatus) => ['projects', status],
    GetById: (id?: string) => ['projects', id],
    GetFromVoucher: (voucher?: TicketVoucherModel) => ['projects', voucher?.project],
    GetFromTicket: (ticket?: TicketModel) => ['projects', ticket?.project],
}
