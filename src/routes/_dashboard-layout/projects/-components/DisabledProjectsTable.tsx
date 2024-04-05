import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAllDisabled } from '@/api/projects/Project_GetAllDisabled'
import BaseProjectsTable from '@/routes/_dashboard-layout/projects/-base/BaseProjectsTable'
import { useQuery } from '@tanstack/react-query'

type Props = {
    page: number
    limit: number
}

export default function DisabledProjectsTable({ page, limit }: Props) {
    const projects = useQuery({
        queryKey: projectQueryKeys.GetAllDisabled(),
        queryFn: () => Project_GetAllDisabled(),
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
