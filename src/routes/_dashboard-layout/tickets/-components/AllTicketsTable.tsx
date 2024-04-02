import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAll } from '@/api/tickets/Tickets_GetAll'
import { TicketModel } from '@/lib/model/ticket.model'
import TicketsTable from '@/routes/_dashboard-layout/tickets/-base/TicketsTable'
import { useQuery } from '@tanstack/react-query'

type ProjectTableProps = {
    page: number
    limit: number
}

export default function AllTicketsTable({ page, limit }: ProjectTableProps) {
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAll,
        queryFn: () => Tickets_GetAll(),
        select: (res) => {
            const processedData = res.data

            return {
                list: processedData,
                total: processedData.length,
            } as TableData<TicketModel>
        },
    })

    return <TicketsTable isLoading={tickets.isLoading} tickets={tickets.data} page={page} limit={limit} />
}
