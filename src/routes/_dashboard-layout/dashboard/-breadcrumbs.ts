import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const DashboardBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Dashboard',
            title: 'Dashboard',
            onClick: () =>
                router.navigate({
                    to: '/dashboard',
                }),
            className: 'breadcrumb',
        },
    },
    dynamic: {},
} satisfies {
    static: Record<'index', BreadcrumbItemType>
    dynamic: object
}
