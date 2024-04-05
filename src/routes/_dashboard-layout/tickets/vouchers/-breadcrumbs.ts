import { handleCopy } from '@/common/util/handleCopy'
import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const TicketVouchersBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Ticket Vouchers',
            title: 'Ticket Vouchers',
            onClick: () =>
                router.navigate({
                    to: '/tickets/vouchers',
                }),
            className: 'breadcrumb',
        },
        create: {
            breadcrumbName: 'Create',
            title: 'Create',
            onClick: () =>
                router.navigate({
                    to: '/tickets/vouchers/create',
                }),
            className: 'breadcrumb',
        },
        disabled: {
            breadcrumbName: 'Disabled',
            title: 'Disabled',
            onClick: () =>
                router.navigate({
                    to: '/tickets/vouchers/disabled',
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
                        to: `/tickets/vouchers/$id`,
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
