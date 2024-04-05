import { Accounts_GetByEmail } from '@/api/accounts/Accounts_GetByEmail'
import { accountQueryKeys } from '@/api/accounts/key.query'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import AccountDetailsView from '@/routes/_dashboard-layout/accounts/-components/AccountDetailsView'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/accounts/email')({
    component: AccountDetails,
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
    notFoundComponent: () => <DetailsNotFound />,
})

function AccountDetails() {
    const email = Route.useSearch({ select: (params) => params.email })
    const account = useQuery({
        queryKey: accountQueryKeys.GetByEmail(email),
        queryFn: () => Accounts_GetByEmail({ email }),
        select: (res) => res.data,
        throwOnError(error) {
            if (error instanceof ResourceNotFoundError) {
                throw notFound({
                    routeId: Route.id,
                })
            }

            throw error
        },
    })

    return <AccountDetailsView account={account} />
}
