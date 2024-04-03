import ContentWrapper, { ContentCardProps } from '@/common/components/ContentWrapper'
import TableActionsButton from '@/common/components/TableActionsButton'
import { BaseModel } from '@/lib/model/base.model'
import { useNavigate } from '@tanstack/react-router'
import { Grid, MenuProps, Table } from 'antd'
import { ColumnType, TableProps } from 'antd/es/table'
import { ColumnsType } from 'antd/lib/table'

type Props<T extends BaseModel> = {
    page: number
    limit: number
    isLoading: boolean
    data: TableData<T> | undefined
    tableWrapperProps?: Partial<ContentCardProps>
    tableProps?: TableProps
    columns: ColumnsType<T>
}

export default function BaseTable<T extends BaseModel>({
    page,
    limit,
    isLoading,
    data = { list: [], total: 0 },
    tableWrapperProps,
    columns,
    tableProps,
}: Props<T>) {
    const navigate = useNavigate()
    const { pagination, ...otherProps } = tableProps || {}

    return (
        <ContentWrapper.ContentCard
            style={{
                marginBottom: '58px',
            }}
            {...tableWrapperProps}
        >
            <Table
                loading={isLoading}
                dataSource={data.list}
                virtual
                tableLayout='fixed'
                bordered
                className='relative'
                columns={[
                    {
                        key: 'table-number',
                        title: '#',
                        render: (_, __, index) => (page - 1) * limit + index + 1,
                        width: 50,
                        ellipsis: true,
                    },
                    ...columns,
                ]}
                pagination={{
                    style: {
                        marginBottom: 0,
                    },
                    total: data?.total,
                    pageSize: limit,
                    defaultCurrent: page,
                    current: page,
                    onChange: (page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page: page,
                                limit: limit,
                            }),
                        })
                    },
                    onShowSizeChange: (page, limit) => {
                        navigate({
                            search: (search) => ({
                                ...search,
                                page: page,
                                limit: limit,
                            }),
                        })
                    },
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                    pageSizeOptions: [8, 16, 24, 32],
                    ...pagination,
                }}
                {...otherProps}
            />
        </ContentWrapper.ContentCard>
    )
}

BaseTable.ColumnActions = function <T extends BaseModel>({
    screens,
    appendActions,
    viewLink,
}: {
    screens: ReturnType<typeof Grid.useBreakpoint>
    appendActions?: (record: T) => MenuProps['items']
    viewLink: string
}): ColumnType<T> {
    return {
        key: 'table-action',
        title: screens.xs ? 'Atn.' : 'Action',
        fixed: 'right',
        width: screens.xs ? 65 : 130,
        render: (_: any, record: T) => <TableActionsButton record={record} viewLink={viewLink} appendItems={appendActions?.(record)} />,
    }
}
