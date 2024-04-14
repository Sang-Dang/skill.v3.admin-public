import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import dayjs from 'dayjs'

export default function BaseTicketOrdersTable(props: BaseTablePropsCommon<TicketOrderModel>) {
    return (
        <BaseTable
            columns={[
                {
                    key: 'ticketOrdersTable-email',
                    title: 'Email',
                    dataIndex: 'email',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'ticketOrdersTable-total',
                    title: 'Total',
                    dataIndex: 'total',
                    width: 100,
                    ellipsis: true,
                    render: (value: number) => `${value.toLocaleString()} VND`,
                },
                {
                    key: 'ticketOrdersTable-status',
                    title: 'Status',
                    dataIndex: 'status',
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: 'ticketOrdersTable-orderItems',
                    title: 'No. Items',
                    ellipsis: true,
                    width: 120,
                    render: (_, record) => record.items.length,
                },
                {
                    key: 'ticketOrdersTable-createdAt',
                    title: 'Created',
                    dataIndex: 'createdAt',
                    width: 160,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
                },
                BaseTable.ColumnActions({
                    viewLink: '/tickets/orders/$id',
                    appendActions: props.appendActions,
                }),
            ]}
            {...props}
        />
    )
}
