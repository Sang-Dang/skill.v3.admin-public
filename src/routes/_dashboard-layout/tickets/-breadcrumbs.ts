import { handleCopy } from '@/common/util/handleCopy'
import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const TicketBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Tickets',
            title: 'Tickets',
            onClick: () =>
                router.navigate({
                    to: '/tickets',
                }),
            className: 'breadcrumb',
        },
        create: {
            breadcrumbName: 'Create',
            title: 'Create',
            onClick: () =>
                router.navigate({
                    to: '/tickets/create',
                }),
            className: 'breadcrumb',
        },
        disabled: {
            breadcrumbName: 'Disabled Tickets',
            title: 'Disabled',
            onClick: () =>
                router.navigate({
                    to: '/tickets/disabled',
                }),
            className: 'breadcrumb',
        },
    },
    dynamic: {
        $id: (id, copyable = true) => ({
            breadcrumbName: 'Ticket',
            title: id || 'Details',
            onClick: () => {
                if (!id) return
                if (copyable) {
                    handleCopy(id)
                } else {
                    router.navigate({
                        to: `/tickets/$id`,
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
    static: Record<'index' | 'create' | 'disabled', BreadcrumbItemType>
    dynamic: {
        $id: (id?: string, copyable?: boolean) => BreadcrumbItemType
    }
}
