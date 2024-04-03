import BaseTable from '@/common/components/BaseTable'
import { ContentCardProps } from '@/common/components/ContentWrapper'
import { TicketModel } from '@/lib/model/ticket.model'
import { Grid, MenuProps, TableProps } from 'antd'
import dayjs from 'dayjs'

type ProjectTableProps = {
    page: number
    limit: number
    isLoading: boolean
    tickets: TableData<TicketModel> | undefined
    tableWrapperProps?: Partial<ContentCardProps>
    appendActions?: (record: TicketModel) => MenuProps['items']
    tableProps?: TableProps<TicketModel>
}

export default function TicketsTable({ tableProps, page, limit, isLoading, tickets, tableWrapperProps, appendActions }: ProjectTableProps) {
    const screens = Grid.useBreakpoint()

    return (
        <BaseTable
            tableProps={tableProps}
            isLoading={isLoading}
            data={tickets}
            page={page}
            limit={limit}
            tableWrapperProps={tableWrapperProps}
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
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'ticketsTable-endDate',
                    title: 'End Date',
                    dataIndex: 'endDate',
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                BaseTable.ColumnActions({
                    screens,
                    viewLink: '/tickets/$id',
                    appendActions,
                }),
            ]}
        />
    )
}
