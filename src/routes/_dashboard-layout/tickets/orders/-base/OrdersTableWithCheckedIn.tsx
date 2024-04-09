import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import TableActionsButton from '@/common/components/TableActionsButton'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import { TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'
import { Grid, Table } from 'antd'
import dayjs from 'dayjs'

export default function OrdersTableWithCheckedIn(props: BaseTablePropsCommon<TicketOrderModel>) {
    const screens = Grid.useBreakpoint()

    return (
        <BaseTable
            tableWrapperProps={{
                useCard: true,
                cardProps: {
                    className: 'mt-5',
                },
            }}
            tableProps={{
                expandable: {
                    columnWidth: 50,
                    indentSize: 0,
                    childrenColumnName: '123',
                    expandedRowRender: (record) => {
                        return (
                            <div className='p-0'>
                                <Table
                                    dataSource={record.items}
                                    pagination={false}
                                    virtual
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
                                        },
                                        {
                                            key: 'table-action-sub',
                                            title: screens.xs ? 'Atn.' : 'Action',
                                            fixed: 'right',
                                            width: screens.xs ? 65 : 130,
                                            render: (_: any, record: TicketOrderItemModel) => (
                                                <TableActionsButton<TicketOrderItemModel>
                                                    record={record}
                                                    viewLink='/tickets/$id'
                                                    customViewId={record.ticket.id}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        )
                    },
                },
            }}
            columns={[
                {
                    key: 'ordersTableWithCheckedIn-email',
                    title: 'Creator Email',
                    dataIndex: 'email',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'ordersTableWithCheckedIn-phone',
                    title: 'Creator Phone',
                    dataIndex: 'phone',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'ordersTableWithCheckedIn-itemsLength',
                    title: 'No. Tickets',
                    width: 100,
                    ellipsis: true,
                    render: (_, record) => record.items.reduce((prev, curr) => prev + curr.quantity, 0),
                },
                {
                    key: 'ordersTableWithCheckedIn-createdAt',
                    title: 'Created',
                    dataIndex: 'createdAt',
                    width: 120,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
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
