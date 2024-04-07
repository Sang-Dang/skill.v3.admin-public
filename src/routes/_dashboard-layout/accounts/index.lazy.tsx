import { accountQueryKeys } from '@/api/accounts/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import { Role } from '@/lib/enum/role.enum'
import { AccountBreadcrumbs } from '@/routes/_dashboard-layout/accounts/-breadcrumbs'
import AccountsByRoleTable from '@/routes/_dashboard-layout/accounts/-components/AccountsByRoleTable'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs } from 'antd'

export const Route = createLazyFileRoute('/_dashboard-layout/accounts/')({
    component: AccountsComponent,
})

export function AccountsComponent() {
    const search = Route.useSearch({
        select: (data) => ({
            limit: data.limit ?? 10,
            page: data.page ?? 1,
            tab: data.tab ?? Role.ADMIN,
        }),
    })
    const navigate = useNavigate()

    return (
        <ContentWrapper
            headTitle='Accounts List'
            title='Accounts List'
            breadcrumbs={[DashboardBreadcrumbs.static.index, AccountBreadcrumbs.static.index]}
        >
            <Tabs
                defaultActiveKey={search.tab}
                style={{
                    marginTop: 25,
                }}
                type='card'
                tabBarStyle={{
                    margin: 0,
                }}
                onTabClick={(key: string) => {
                    navigate({
                        search: {
                            page: undefined,
                            limit: undefined,
                            tab: key,
                        },
                    })
                }}
                destroyInactiveTabPane
                tabBarExtraContent={<RefreshButton queryKey={accountQueryKeys.GetAll()} />}
                items={[
                    {
                        tabKey: Role.ADMIN,
                        key: Role.ADMIN,
                        id: Role.ADMIN,
                        label: 'Admin',
                        children: <AccountsByRoleTable role={Role.ADMIN} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Role.USER,
                        tabKey: Role.USER,
                        id: Role.USER,
                        label: 'User',
                        children: <AccountsByRoleTable role={Role.USER} page={search.page} limit={search.limit} />,
                    },
                    {
                        key: Role.STAFF,
                        tabKey: Role.STAFF,
                        id: Role.STAFF,
                        label: 'Staff',
                        children: <AccountsByRoleTable role={Role.STAFF} page={search.page} limit={search.limit} />,
                    },
                ]}
            />
        </ContentWrapper>
    )
}
