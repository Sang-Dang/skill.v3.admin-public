import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import { TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'

export default function BaseOrderItemsTable(props: BaseTablePropsCommon<TicketOrderItemModel>) {
    return (
        <BaseTable
            columns={[
                {
                    key: 'OrderItemsTable-name',
                    title: 'Ticket Name',
                    dataIndex: 'name',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'OrderItemsTable-price',
                    title: 'Price',
                    dataIndex: 'price',
                    width: 100,
                    ellipsis: true,
                    render: (value: number) => `${value.toLocaleString()} VND`,
                },
                {
                    key: 'OrderItemsTable-quantity',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    width: 100,
                    ellipsis: true,
                },
                BaseTable.ColumnActions({
                    appendActions: props.appendActions,
                    viewLink: '/tickets/$id',
                    customViewId: (record) => record.ticket.id,
                }),
            ]}
            {...props}
        />
    )
}
