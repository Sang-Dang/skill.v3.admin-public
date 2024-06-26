import { Accounts_GetById } from '@/api/accounts/Accounts_GetById'
import { accountQueryKeys } from '@/api/accounts/key.query'
import DetailsNotFound from '@/common/pages/DetailsNotFound'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import AccountDetailsView from '@/routes/_dashboard-layout/accounts/-components/AccountDetailsView'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, notFound } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard-layout/accounts/$id')({
    component: AccountDetails,
    notFoundComponent: () => <DetailsNotFound />,
})

function AccountDetails() {
    const id = Route.useParams({ select: (params) => params.id })
    const account = useQuery({
        queryKey: accountQueryKeys.GetById(id),
        queryFn: () => Accounts_GetById({ id }),
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
