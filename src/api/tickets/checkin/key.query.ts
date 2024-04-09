export const ticketCheckInQueryKeys = {
    GetAll: () => ['tickets', 'check-in'],
    GetAllByOrderId: (idOrder: string) => ['tickets', 'check-in', idOrder],
    GetFullOrdersByProjectId: (projectId: string) => ['tickets', 'check-in', projectId],
}
