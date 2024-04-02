export const ticketsQueryKeys = {
    GetAll: () => ['tickets'],
    GetById: (id: string) => ['tickets', id],
    GetByProjectId: (projectId: string) => ['tickets', projectId],
}
