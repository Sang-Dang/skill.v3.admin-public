import { Accounts_GetById } from '@/api/accounts/Accounts_GetById'
import { accountQueryKeys } from '@/api/accounts/key.query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/accounts/$id')({
    parseParams: (rawParams: Record<string, string>) => {
        return {
            id: rawParams.id,
        }
    },
    loader: ({ context: { queryClient }, params: { id } }) => {
        queryClient.prefetchQuery({
            queryKey: accountQueryKeys.GetById(id),
            queryFn: () => Accounts_GetById({ id }),
        })
    },
})