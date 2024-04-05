import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import DisabledTag from '@/common/components/DisabledTag'
import { ProjectModel } from '@/lib/model/project.model'
import dayjs from 'dayjs'

export default function BaseProjectsTable(props: BaseTablePropsCommon<ProjectModel>) {
    return (
        <BaseTable
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
                {
                    key: 'projectsTable-active',
                    title: 'Active',
                    width: 75,
                    ellipsis: true,
                    render: (_, record) => <DisabledTag disabledAt={record.deletedAt} showEnabled />,
                    filters: [
                        { text: 'Enabled', value: true },
                        { text: 'Disabled', value: false },
                    ],
                    onFilter: (_, record) => !!record.deletedAt,
                },
                {
                    key: 'projectsTable-updatedAt',
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
                    viewLink: '/projects/$id',
                    appendActions: props.appendActions,
                }),
            ]}
            {...props}
        />
    )
}
