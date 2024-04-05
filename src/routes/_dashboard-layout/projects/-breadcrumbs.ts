import { handleCopy } from '@/common/util/handleCopy'
import { router } from '@/router'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'

export const ProjectBreadcrumbs = {
    static: {
        index: {
            breadcrumbName: 'Projects',
            title: 'Projects',
            onClick: () =>
                router.navigate({
                    to: '/projects',
                }),
            className: 'breadcrumb',
        },
        create: {
            breadcrumbName: 'Create',
            title: 'Create',
            onClick: () =>
                router.navigate({
                    to: '/projects/create',
                }),
            className: 'breadcrumb',
        },
        disabled: {
            breadcrumbName: 'Disabled Projects',
            title: 'Disabled',
            onClick: () =>
                router.navigate({
                    to: '/projects/disabled',
                }),
            className: 'breadcrumb',
        },
    },
    dynamic: {
        $id: (id, copyable = true) => ({
            breadcrumbName: 'Project',
            title: id || 'Details',
            onClick: () => {
                if (!id) return
                if (copyable) {
                    handleCopy(id)
                } else {
                    router.navigate({
                        to: `/projects/$id`,
                        params: {
                            id,
                        },
                    })
                }
            },
            className: 'breadcrumb',
        }),
        checkin: (id) => ({
            breadcrumbName: 'Check In',
            title: 'Check In',
            onClick: () => {
                if (!id) return
                router.navigate({
                    to: `/projects/$id/checkin`,
                    params: {
                        id,
                    },
                })
            },
            className: 'breadcrumb',
        }),
    },
} satisfies {
    static: Record<'index' | 'create' | 'disabled', BreadcrumbItemType>
    dynamic: {
        $id: (id?: string, copyable?: boolean) => BreadcrumbItemType
        checkin: (id?: string) => BreadcrumbItemType
    }
}
