import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAll } from '@/api/tickets/Tickets_GetAll'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import { useQuery } from '@tanstack/react-query'

type ProjectTableProps = {
    page: number
    limit: number
}

export default function AllTicketsTable({ page, limit }: ProjectTableProps) {
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAll(),
        queryFn: () => Tickets_GetAll(),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <TicketsTable
            isLoading={tickets.isLoading}
            tickets={tickets.data}
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
