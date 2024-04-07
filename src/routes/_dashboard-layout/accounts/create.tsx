import { Accounts_GetAll } from '@/api/accounts/Accounts_GetAll'
import { accountQueryKeys } from '@/api/accounts/key.query'
import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, defer, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/accounts/create')({
    beforeLoad: async ({ context: { authHandler }, location }) => {
        const response = await authHandler.authorize(Role.ADMIN)
        if (!response) {
            throw redirect({
                to: '/',
                search: {
                    error: "You don't have permission to access this page.",
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
    loader: ({ context: { queryClient } }) => {
        const accounts = queryClient.ensureQueryData({
            queryKey: accountQueryKeys.GetAll(),
            queryFn: Accounts_GetAll,
        })

        return {
            accounts: defer(accounts),
        }
    },
})
