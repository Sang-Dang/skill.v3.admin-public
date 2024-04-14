import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import { ITicketCheckInParsed } from '@/lib/model/ticketCheckIn.model'
import { TicketOrderModel } from '@/lib/model/ticketOrder.model'
import { TicketOrderItemModel } from '@/lib/model/ticketOrderItem.model'
import { LinkOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Table, Tag } from 'antd'
import dayjs from 'dayjs'

export default function OrdersTableWithCheckedIn(
    props: BaseTablePropsCommon<TicketOrderModel> & {
        checkIns?: ITicketCheckInParsed
    },
) {
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
                    expandedRowRender: (orderRecord: TicketOrderModel) => {
                        return (
                            <div className='p-0'>
                                <Table
                                    dataSource={orderRecord.items}
                                    pagination={false}
                                    bordered={true}
                                    size='middle'
                                    columns={[
                                        {
                                            key: 'ordersTableWithCheckedIn-no',
                                            title: '#',
                                            width: 30,
                                            align: 'center',
                                            render: (_, __, index) => index + 1,
                                        },
                                        {
                                            key: 'ordersTableWithCheckedIn-items-name',
                                            title: 'Ticket',
                                            width: 100,
                                            ellipsis: true,
                                            render: (_, record: TicketOrderItemModel) => (
                                                <Link
                                                    to={'/tickets/$id'}
                                                    params={{
                                                        id: record.ticket.id,
                                                    }}
                                                >
                                                    {record.name} <LinkOutlined />
                                                </Link>
                                            ),
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
                                            render: (_, itemRecord) => {
                                                const checkedInCount = props.checkIns?.[orderRecord.id]?.[itemRecord.id]
                                                if (checkedInCount === itemRecord.quantity) {
                                                    return <Tag color='green'>Done</Tag>
                                                } else {
                                                    return <>{checkedInCount} Checked In</>
                                                }
                                            },
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
                    width: 70,
                    ellipsis: true,
                    render: (_, record) => record.items.reduce((prev, curr) => prev + curr.quantity, 0),
                },
                {
                    key: 'ordersTableWithCheckedIn-status',
                    title: 'Status',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                    render: (_, record) =>
                        record.items.every((item) => item.quantity === props.checkIns?.[record.id]?.[item.id]) &&
                        record.items.length > 0 ? (
                            <Tag color='green'>Done</Tag>
                        ) : (
                            <Tag color='red'>Pending</Tag>
                        ),
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
