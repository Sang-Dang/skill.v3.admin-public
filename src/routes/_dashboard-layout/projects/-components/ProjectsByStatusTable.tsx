import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAllByStatus } from '@/api/projects/Project_GetAllByStatus'
import { ProjectStatus } from '@/lib/enum/project-status.enum'
import BaseProjectsTable from '@/routes/_dashboard-layout/projects/-base/BaseProjectsTable'
import { useQuery } from '@tanstack/react-query'

type ProjectTableProps = {
    page: number
    limit: number
    status: ProjectStatus
}

export default function ProjectsByStatusTable({ page, limit, status }: ProjectTableProps) {
    const projects = useQuery({
        queryKey: projectQueryKeys.GetAllByStatus(status),
        queryFn: () => Project_GetAllByStatus({ status }),
        select: (res) => ({
            list: res.data,
            total: res.data.length,
        }),
    })

    return (
        <BaseProjectsTable
            isLoading={projects.isLoading}
            page={page}
            limit={limit}
            data={projects.data}
            tableWrapperProps={{
                style: {
                    borderTopLeftRadius: 0,
                },
            }}
        />
    )
}
