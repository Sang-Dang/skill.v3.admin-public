// ! DO NOT USE. STILL IN CHINESE

import TableActionsButton from '@/common/components/TableActionsButton'
import { TicketModel } from '@/lib/model/ticket.model'
import { ProTable } from '@ant-design/pro-components'
import { Grid } from 'antd'
import dayjs from 'dayjs'

type Props = {
    tickets: TicketModel[]
    page: number
    limit: number
}

export default function ProTicketsTable({ tickets, limit, page }: Props) {
    const screens = Grid.useBreakpoint()

    return (
        <ProTable<TicketModel>
            dataSource={tickets}
            tableLayout='fixed'
            virtual
            options={{
                fullScreen: true,
                setting: {
                    checkedReset: true,
                },
            }}
            ghost
            search={
                false
                //     {
                //     searchText: 'Search',
                //     resetText: 'Reset',
                //     collapseRender: (collapsed) => (
                //         <Button type='link' icon={collapsed ? <UpCircleFilled /> : <DownCircleFilled />}>
                //             {collapsed ? 'More' : 'Less'}
                //         </Button>
                //     ),
                //     layout: 'vertical',
                // }
            }
            pagination={{
                showTotal: (total, range) => <div>{`Showing ${range[0]}-${range[1]} of ${total} total items`}</div>,
            }}
            columns={[
                {
                    key: 'ticketsTable-number',
                    title: '#',
                    render: (_, __, index) => (page - 1) * limit + index + 1,
                    width: 50,
                    ellipsis: true,
                },
                {
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
                    render: (_, entity) => `${entity.price.toLocaleString()} VND`,
                },
                {
                    key: 'ticketsTable-quantity',
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    width: 100,
                    ellipsis: true,
                    render: (_, entity) => entity.quantity.toLocaleString(),
                },
                {
                    key: 'ticketsTable-startDate',
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    ellipsis: true,
                    render: (_, entity) => dayjs(entity.startDate).format('YYYY-MM-DD'),
                },
                {
                    key: 'ticketsTable-endDate',
                    title: 'End Date',
                    dataIndex: 'endDate',
                    ellipsis: true,
                    render: (_, entity) => dayjs(entity.endDate).format('YYYY-MM-DD'),
                },
                {
                    key: 'ticketsTable-action',
                    title: screens.xs ? 'Atn.' : 'Action',
                    fixed: 'right',
                    width: screens.xs ? 65 : 130,
                    render: (_, record) => <TableActionsButton record={record} viewLink='/tickets/$id' />,
                },
            ]}
        />
    )
}
