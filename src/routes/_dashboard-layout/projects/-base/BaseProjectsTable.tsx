import ContentWrapper from '@/common/components/ContentWrapper'
import TableActionsButton from '@/common/components/TableActionsButton'
import { ProjectModel } from '@/lib/model/project.model'
import { useNavigate } from '@tanstack/react-router'
import { Grid, Pagination, Table, theme } from 'antd'
import dayjs from 'dayjs'

type ProjectTableProps = {
    page: number
    limit: number
    projects: TableData<ProjectModel>
    isLoading: boolean
}

export default function BaseProjectsTable({ page, limit, projects, isLoading }: ProjectTableProps) {
    const navigate = useNavigate()
    const { token } = theme.useToken()
    const screens = Grid.useBreakpoint()

    return (
        <>
            <ContentWrapper.ContentCard>
                <Table
                    loading={isLoading}
                    dataSource={projects?.list ?? []}
                    virtual
                    tableLayout='fixed'
                    bordered
                    columns={[
                        {
                            key: 'projectsTable-number',
                            title: '#',
                            render: (_, __, index) => (page - 1) * limit + index + 1,
                            width: 50,
                            ellipsis: true,
                        },
                        {
                            key: 'projectsTable-projectName',
                            title: 'Project Name',
                            dataIndex: 'projectName',
                            width: 150,
                            ellipsis: true,
                        },
                        {
                            key: 'projectsTable-startDate',
                            title: 'Start Date',
                            dataIndex: 'startDate',
                            width: 150,
                            ellipsis: true,
                            render: (value) => dayjs(value).format('YYYY-MM-DD'),
                        },
                        {
                            key: 'projectsTable-endDate',
                            title: 'End Date',
                            dataIndex: 'endDate',
                            width: 150,
                            ellipsis: true,
                            render: (value) => dayjs(value).format('YYYY-MM-DD'),
                        },
                        {
                            key: 'projectsTable-action',
                            title: screens.xs ? 'Atn.' : 'Action',
                            fixed: 'right',
                            width: screens.xs ? 65 : 130,
                            render: (_, record) => <TableActionsButton record={record} viewLink='/projects/$id' />,
                        },
                    ]}
                    pagination={false}
                />
            </ContentWrapper.ContentCard>
            <ContentWrapper.ContentCard
                style={{
                    marginTop: 25,
                    width: 'max-content',
                    borderTopLeftRadius: token.borderRadiusLG,
                }}
            >
                <Pagination
                    total={projects?.total}
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
