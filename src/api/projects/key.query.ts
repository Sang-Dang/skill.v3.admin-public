import { ProjectStatus } from '@/lib/enum/project-status.enum'

export const projectQueryKeys = {
    GetAll: () => ['projects'],
    GetAllByStatus: (status: ProjectStatus) => ['projects', status],
    GetById: (id: string) => ['projects', id],
}
