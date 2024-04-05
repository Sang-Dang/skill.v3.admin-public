import ContentWrapper, { ContentCardProps } from '@/common/components/ContentWrapper'
import TableActionsButton from '@/common/components/TableActionsButton'
import { BaseModel } from '@/lib/model/base.model'
import { useNavigate } from '@tanstack/react-router'
import { Grid, MenuProps, Table } from 'antd'
import { ColumnType, TableProps } from 'antd/es/table'
import { ColumnsType } from 'antd/lib/table'

export type BaseTableProps<T> = {
    page: number
    limit: number
    isLoading: boolean
    data: TableData<T> | undefined
    tableWrapperProps?: Partial<ContentCardProps>
    tableProps?: TableProps
    columns: ColumnsType<T>
}

export type BaseTablePropsCommon<T> = Pick<
    BaseTableProps<T>,
    'page' | 'limit' | 'isLoading' | 'data' | 'tableWrapperProps' | 'tableProps'
> & {
    appendActions?: (record: T) => MenuProps['items']
}

export default function BaseTable<T>({
    page,
    limit,
    isLoading,
    data = { list: [], total: 0 },
    tableWrapperProps,
    columns,
    tableProps,
}: BaseTableProps<T>) {
    const navigate = useNavigate()
    const { pagination, ...otherProps } = tableProps || {}

    return (
        <ContentWrapper.ContentCard {...tableWrapperProps}>
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

BaseTable.ColumnActions = function ColumnActionsBuilder<T extends BaseModel>({
    appendActions,
    viewLink,
    customViewId,
}: {
    appendActions?: (record: T) => MenuProps['items']
    viewLink?: string
    customViewId?: (record: T) => string | string
}): ColumnType<T> {
    const screens = Grid.useBreakpoint()

    return {
        key: 'table-action',
        title: screens.xs ? 'Atn.' : 'Action',
        fixed: 'right',
        width: screens.xs ? 65 : 130,
        render: (_: any, record: T) => (
            <TableActionsButton
                record={record}
                viewLink={viewLink}
                customViewId={typeof customViewId === 'string' ? customViewId : customViewId?.(record)}
                appendItems={appendActions?.(record)}
            />
        ),
    }
}
