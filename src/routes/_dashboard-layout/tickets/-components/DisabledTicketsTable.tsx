import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAllDisabled } from '@/api/tickets/Tickets_GetAllDisabled'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import { useQuery } from '@tanstack/react-query'

type ProjectTableProps = {
    page: number
    limit: number
}

export default function DisabledTicketsTable({ page, limit }: ProjectTableProps) {
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAllDisabled(),
        queryFn: () => Tickets_GetAllDisabled(),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <TicketsTable
            isLoading={tickets.isLoading}
            data={tickets.data}
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
