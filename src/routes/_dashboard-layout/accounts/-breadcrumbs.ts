import { handleCopy } from '@/common/util/handleCopy'
import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const AccountBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Accounts',
            title: 'Accounts',
            onClick: () =>
                router.navigate({
                    to: '/accounts',
                }),
            className: 'breadcrumb',
        },
        create: {
            breadcrumbName: 'Create',
            title: 'Create',
            onClick: () =>
                router.navigate({
                    to: '/accounts/create',
                }),
            className: 'breadcrumb',
        },
    },
    dynamic: {
        $id: (id, copyable = true) => ({
            breadcrumbName: 'Account',
            title: id || 'Details',
            onClick: () => {
                if (!id) return
                if (copyable) {
                    handleCopy(id)
                } else {
                    router.navigate({
                        to: `/accounts/$id`,
                        params: {
                            id,
                        },
                    })
                }
            },
            className: 'breadcrumb',
        }),
    },
} satisfies {
    static: Record<'index' | 'create', BreadcrumbItemType>
    dynamic: {
        $id: (id?: string, copyable?: boolean) => BreadcrumbItemType
    }
}
