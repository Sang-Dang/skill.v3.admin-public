import ContentWrapper, { ContentCardProps } from '@/common/components/ContentWrapper'
import TableActionsButton from '@/common/components/TableActionsButton'
import { TicketModel } from '@/lib/model/ticket.model'
import { useNavigate } from '@tanstack/react-router'
import { Grid, Pagination, Table } from 'antd'
import dayjs from 'dayjs'

type ProjectTableProps = {
    page: number
    limit: number
    isLoading: boolean
    tickets: TableData<TicketModel> | undefined
    tableWrapperProps?: Partial<ContentCardProps>
    paginationWrapperProps?: Partial<ContentCardProps>
}

export default function TicketsTable({ page, limit, isLoading, tickets, tableWrapperProps, paginationWrapperProps }: ProjectTableProps) {
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint()

    return (
        <>
            <ContentWrapper.ContentCard {...tableWrapperProps}>
                <Table
                    loading={isLoading}
                    dataSource={tickets?.list ?? []}
                    virtual
                    tableLayout='fixed'
                    bordered
                    columns={[
                        {
                            key: 'ticketsTable-number',
                            title: '#',
                            render: (_, __, index) => (page - 1) * limit + index + 1,
                            width: 50,
                            ellipsis: true,
                        },
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
                        {
                            key: 'ticketsTable-action',
                            title: screens.xs ? 'Atn.' : 'Action',
                            fixed: 'right',
                            width: screens.xs ? 65 : 130,
                            render: (_, record) => <TableActionsButton record={record} viewLink='/tickets/$id' />,
                        },
                    ]}
                    pagination={false}
                />
            </ContentWrapper.ContentCard>
            <ContentWrapper.ContentCard
                style={{
                    marginTop: 25,
                    width: 'max-content',
                }}
                {...paginationWrapperProps}
            >
                <Pagination
                    total={tickets?.total}
                    pageSize={limit}
                    defaultCurrent={page}
                    current={page}
                    onChange={(page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page,
                                limit,
                            }),
                        })
                    }}
                    onShowSizeChange={(page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page,
                                limit,
                            }),
                        })
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} items`}
                    pageSizeOptions={[8, 16, 24, 32]}
                />
            </ContentWrapper.ContentCard>
        </>
    )
}
