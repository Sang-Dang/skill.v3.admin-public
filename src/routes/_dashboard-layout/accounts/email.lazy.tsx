import { Accounts_GetByEmail } from '@/api/accounts/Accounts_GetByEmail'
import { accountQueryKeys } from '@/api/accounts/key.query'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import AccountDetailsView from '@/routes/_dashboard-layout/accounts/-components/AccountDetailsView'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, notFound } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard-layout/accounts/email')({
    component: AccountDetails,
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
                    routeId: Route.options.id as any,
                })
            }

            throw error
        },
    })

    return <AccountDetailsView account={account} />
}
