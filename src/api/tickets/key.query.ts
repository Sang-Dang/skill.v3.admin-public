export const ticketsQueryKeys = {
    GetAll: () => ['tickets'],
    GetById: (id: string) => ['tickets', id],
    GetAllByProjectId: (projectId: string) => ['tickets', projectId],
    GetManyById: (ids: string[]) => ['tickets', ids],
}
