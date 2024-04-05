import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import DisabledTag from '@/common/components/DisabledTag'
import { TicketModel } from '@/lib/model/ticket.model'
import dayjs from 'dayjs'

export default function TicketsTable(props: BaseTablePropsCommon<TicketModel>) {
    return (
        <BaseTable
            columns={[
                {
                    key: 'ticketsTable-ticketName',
                    title: 'Ticket Name',
                    dataIndex: 'ticketName',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'ticketsTable-price',
                    title: 'Price',
                    dataIndex: 'price',
                    width: 100,
                    ellipsis: true,
                    render: (value: number) => `${value.toLocaleString()} VND`,
                },
                {
                    key: 'ticketsTable-quantity',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    width: 100,
                    ellipsis: true,
                    render: (value: number) => value.toLocaleString(),
                },
                {
                    key: 'ticketsTable-startDate',
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    ellipsis: true,
                    width: 120,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'ticketsTable-endDate',
                    title: 'End Date',
                    dataIndex: 'endDate',
                    width: 120,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'ticketsTable-active',
                    title: 'Active',
                    width: 100,
                    ellipsis: true,
                    render: (_, record) => <DisabledTag disabledAt={record.deletedAt} showEnabled />,
                },
                {
                    key: 'ticketsTable-updatedAt',
                    title: 'Last Modified',
                    dataIndex: 'updatedAt',
                    width: 150,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm'),
                    sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
                    sortDirections: ['descend', 'ascend'],
                    defaultSortOrder: 'descend',
                },
                BaseTable.ColumnActions({
                    viewLink: '/tickets/$id',
                    appendActions: props.appendActions,
                }),
            ]}
            {...props}
        />
    )
}
