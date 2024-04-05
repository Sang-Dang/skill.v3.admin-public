import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import DisabledTag from '@/common/components/DisabledTag'
import { TicketVoucherModel } from '@/lib/model/ticketVoucher.model'
import dayjs from 'dayjs'

export default function BaseVouchersTable(props: BaseTablePropsCommon<TicketVoucherModel>) {
    return (
        <BaseTable
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
                    width: 150,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'vouchersTable-endDate',
                    title: 'End Date',
                    dataIndex: 'endDate',
                    width: 150,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                    key: 'vouchersTable-active',
                    title: 'Active',
                    width: 100,
                    ellipsis: true,
                    render: (_, record) => <DisabledTag disabledAt={record.deletedAt} showEnabled />,
                },
                {
                    key: 'vouchersTable-updatedAt',
                    title: 'Last Modified',
                    dataIndex: 'updatedAt',
                    width: 150,
                    ellipsis: true,
                    render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm'),
                    sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
                    sortDirections: ['descend', 'ascend'],
                    defaultSortOrder: 'descend',
                },
                BaseTable.ColumnActions<TicketVoucherModel>({ viewLink: '/tickets/vouchers/$id', appendActions: props.appendActions }),
            ]}
            {...props}
        />
    )
}
