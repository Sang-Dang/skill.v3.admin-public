import { Accounts_GetAllByRole } from '@/api/accounts/Accounts_GetAllByRole'
import { accountQueryKeys } from '@/api/accounts/key.query'
import { Role } from '@/lib/enum/role.enum'
import BaseAccountsTable from '@/routes/_dashboard-layout/accounts/-base/BaseAccountsTable'
import { useQuery } from '@tanstack/react-query'

type AccountTableProps = {
    role: Role
    page: number
    limit: number
}

export default function AccountsByRoleTable({ role, page, limit }: AccountTableProps) {
    const accounts = useQuery({
        queryKey: accountQueryKeys.GetAllByRole(role),
        queryFn: () => Accounts_GetAllByRole({ role }),
        select: (res) => {
            const processedData = res.data.slice((page - 1) * limit, page * limit)
            return {
                list: processedData,
                total: processedData.length,
            }
        },
    })

    return <BaseAccountsTable isLoading={accounts.isLoading} page={page} limit={limit} accounts={accounts.data} />
}
