import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import { ITicketCheckInFlat } from '@/lib/model/ticketCheckIn.model'
import { TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'
import { Tag } from 'antd'

export default function OrderItemsWithCheckedIn(
    props: BaseTablePropsCommon<TicketOrderItemModel> & {
        checkedInData?: ITicketCheckInFlat
    },
) {
    console.log(props.checkedInData)

    return (
        <BaseTable
            tableWrapperProps={{
                useCard: true,
                cardProps: {
                    className: 'mt-5',
                },
            }}
            columns={[
                {
                    key: 'ordersTableWithCheckedIn-items-name',
                    title: 'Ticket',
                    dataIndex: 'name',
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: 'ordersTableWithCheckedIn-items-quantity',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: 'ordersTableWithCheckedIn-items-checkedIn',
                    title: 'Checked In',
                    dataIndex: 'checkedIn',
                    width: 100,
                    ellipsis: true,
                    render: (_: number, record) => {
                        if (record.quantity === props.checkedInData?.[record.id]) return <Tag color='green'>Done</Tag>
                        else return props.checkedInData?.[record.id] || 0
                    },
                },
                BaseTable.ColumnActions({
                    viewLink: '/tickets/$id',
                    appendActions: props.appendActions,
                    customViewId(record) {
                        return record.ticket.id
                    },
                }),
            ]}
            {...props}
        />
    )
}
