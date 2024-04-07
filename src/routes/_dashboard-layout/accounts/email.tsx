import { Accounts_GetByEmail } from '@/api/accounts/Accounts_GetByEmail'
import { accountQueryKeys } from '@/api/accounts/key.query'
import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/accounts/email')({
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
    validateSearch: z.object({
        email: z.string().email(),
    }),
    loaderDeps: (opts) => {
        return {
            email: opts.search.email,
        }
    },
    loader: ({ context: { queryClient }, deps: { email } }) => {
        queryClient.prefetchQuery({
            queryKey: accountQueryKeys.GetByEmail(email),
            queryFn: () => Accounts_GetByEmail({ email }),
        })
    },
})