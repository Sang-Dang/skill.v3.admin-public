import { Role } from '@/lib/enum/role.enum'
import { ProjectDisabledTabs } from '@/routes/_dashboard-layout/projects/-utils/ProjectDisabledTabs.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/projects/disabled')({
    beforeLoad: async ({ context: { authHandler }, location }) => {
        const response = await authHandler.authorize(Role.ADMIN)
        if (!response) {
            throw redirect({
                to: '/',
                search: {
                    error: "You don't have permission to access this page.",
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
    validateSearch: z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
        tab: z.nativeEnum(ProjectDisabledTabs).optional(),
    }),
})
