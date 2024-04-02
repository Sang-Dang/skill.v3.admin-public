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
        select: (res) => {
            const data = res.data.slice((page - 1) * limit, page * limit)

            return {
                list: data,
                total: data.length,
            }
        },
    })

    return <BaseProjectsTable isLoading={projects.isLoading} page={page} limit={limit} projects={projects.data} />
}
