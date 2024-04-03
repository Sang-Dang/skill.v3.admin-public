import BaseTable from '@/common/components/BaseTable'
import { ContentCardProps } from '@/common/components/ContentWrapper'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import { Grid, MenuProps, TableProps } from 'antd'
import dayjs from 'dayjs'

type ProjectTableProps = {
    page: number
    limit: number
    isLoading: boolean
    vouchers: TableData<TicketVoucherModel> | undefined
    tableWrapperProps?: Partial<ContentCardProps>
    appendActions?: (record: TicketVoucherModel) => MenuProps['items']
    tableProps?: TableProps<TicketVoucherModel>
}

export default function BaseVouchersTable({
    tableProps,
    page,
    limit,
    isLoading,
    vouchers,
    tableWrapperProps,
    appendActions,
}: ProjectTableProps) {
    const screens = Grid.useBreakpoint()

    return (
        <BaseTable
            tableProps={tableProps}
            data={vouchers}
            tableWrapperProps={tableWrapperProps}
            isLoading={isLoading}
            limit={limit}
            page={page}
            columns={[
                {
                    key: 'vouchersTable-voucherCode',
                    title: 'Code',
                    dataIndex: 'voucherCode',
                    width: 200,
                    ellipsis: true,
                },
                {
                    key: 'vouchersTable-discount',
                    title: 'Discount',
                    dataIndex: 'discount',
                    width: 150,
                    ellipsis: true,
                    render: (value: number) => `${value.toLocaleString()} VND`,
                },
                {
                    key: 'vouchersTable-quantity',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    width: 150,
                    ellipsis: true,
                    render: (value: number) => value.toLocaleString(),
                },
                {
                    key: 'vouchersTable-startDate',
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'vouchersTable-endDate',
                    title: 'End Date',
                    dataIndex: 'endDate',
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                BaseTable.ColumnActions<TicketVoucherModel>({ screens, viewLink: '/vouchers/$id', appendActions }),
            ]}
        />
    )
}
