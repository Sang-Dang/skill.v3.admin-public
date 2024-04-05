import { handleCopy } from '@/common/util/handleCopy'
import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const TicketOrdersBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Orders',
            title: 'Orders',
            onClick: () =>
                router.navigate({
                    to: '/tickets/orders',
                }),
            className: 'breadcrumb',
        },
        create: {
            breadcrumbName: 'Create',
            title: 'Create',
            onClick: () =>
                router.navigate({
                    to: '/tickets/orders/create',
                }),
            className: 'breadcrumb',
        },
    },
    dynamic: {
        $id: (id, copyable = true) => ({
            breadcrumbName: 'Ticket Order',
            title: id || 'Details',
            onClick: () => {
                if (!id) return
                if (copyable) {
                    handleCopy(id)
                } else {
                    router.navigate({
                        to: `/tickets/orders/$id`,
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
