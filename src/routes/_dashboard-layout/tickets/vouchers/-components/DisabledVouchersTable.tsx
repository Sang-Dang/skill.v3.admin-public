import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_GetAllDisabled } from '@/api/tickets/voucher/TicketVoucher_GetAllDisabled'
import BaseVouchersTable from '@/routes/_dashboard-layout/tickets/vouchers/-base/BaseVouchersTable'
import { useQuery } from '@tanstack/react-query'

type Props = {
    page: number
    limit: number
}

export default function DisabledVouchersTable({ limit, page }: Props) {
    const vouchers = useQuery({
        queryKey: ticketVoucherQueryKeys.GetAllDisabled(),
        queryFn: () => TicketVoucher_GetAllDisabled(),
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
