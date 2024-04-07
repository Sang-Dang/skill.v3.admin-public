export const ticketsQueryKeys = {
    GetAll: () => ['tickets', 'check-in'],
    GetAllByOrderId: (idOrder: string) => ['tickets', 'check-in', idOrder],
}
