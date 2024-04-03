import BaseTable from '@/common/components/BaseTable'
import { ContentCardProps } from '@/common/components/ContentWrapper'
import { ProjectModel } from '@/lib/model/project.model'
import { Grid, MenuProps } from 'antd'
import { TableProps } from 'antd/lib/table'
import dayjs from 'dayjs'

type ProjectTableProps = {
    page: number
    limit: number
    projects: TableData<ProjectModel>
    isLoading: boolean
    tableWrapperProps?: Partial<ContentCardProps>
    appendActions?: (record: ProjectModel) => MenuProps['items']
    tableProps?: TableProps<ProjectModel>
}

export default function BaseProjectsTable({
    tableProps,
    page,
    limit,
    projects,
    isLoading,
    tableWrapperProps,
    appendActions,
}: ProjectTableProps) {
    const screens = Grid.useBreakpoint()

    return (
        <BaseTable
            tableProps={tableProps}
            isLoading={isLoading}
            data={projects}
            page={page}
            limit={limit}
            tableWrapperProps={tableWrapperProps}
            columns={[
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
                BaseTable.ColumnActions({
                    screens,
                    viewLink: '/projects/$id',
                    appendActions,
                }),
            ]}
        />
    )
}
