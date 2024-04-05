import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetAllByStatus } from '@/api/tickets/voucher/TicketVoucher_GetAllByStatus'
import { TicketVoucherStatus } from '@/lib/enum/ticket-status.enum'
import BaseVouchersTable from '@/routes/_dashboard-layout/tickets/vouchers/-base/BaseVouchersTable'
import { useQuery } from '@tanstack/react-query'

type Props = {
    status: TicketVoucherStatus
    page: number
    limit: number
}

export default function VouchersByStatusTable({ status, limit, page }: Props) {
    const vouchers = useQuery({
        queryKey: ticketVoucherQueryKeys.GetAllByStatus(status),
        queryFn: () => TicketVoucher_GetAllByStatus({ status }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <BaseVouchersTable
            isLoading={vouchers.isLoading}
            data={vouchers.data}
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
