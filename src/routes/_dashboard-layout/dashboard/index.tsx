import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/dashboard/')({
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
})
