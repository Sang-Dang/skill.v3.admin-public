import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import { TicketOrders_GetAllByStatus } from '@/api/tickets/orders/TicketOrders_GetAllByStatus'
import { TicketOrderStatus } from '@/lib/enum/ticketOrder-status.enum'
import BaseTicketOrdersTable from '@/routes/_dashboard-layout/tickets/orders/-base/BaseTicketOrdersTable'
import { useQuery } from '@tanstack/react-query'

type ProjectTableProps = {
    page: number
    limit: number
    status: TicketOrderStatus
}

export default function TicketOrderByStatusTable({ page, limit, status }: ProjectTableProps) {
    const ticketOrders = useQuery({
        queryKey: ticketOrdersQueryKeys.GetAllByStatus(status),
        queryFn: () => TicketOrders_GetAllByStatus({ status }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <BaseTicketOrdersTable
            isLoading={ticketOrders.isLoading}
            data={ticketOrders.data}
            page={page}
            limit={limit}
            tableWrapperProps={{
                style: {
                    borderTopLeftRadius: 0,
                },
            }}
        />
    )
}
