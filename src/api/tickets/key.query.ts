export const ticketsQueryKeys = {
    GetAll: () => ['tickets'],
    GetAllDisabled: () => ['tickets', 'disabled'],
    GetById: (id: string) => ['tickets', id],
    GetAllByProjectId: (projectId: string) => ['tickets', projectId],
    GetManyById: (ids: string[]) => ['tickets', ids],
}
