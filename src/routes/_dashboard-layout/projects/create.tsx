import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import { Role } from '@/lib/enum/role.enum'
import { createFileRoute, defer, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard-layout/projects/create')({
    loader: ({ context: { queryClient } }) => {
        const projects = queryClient.ensureQueryData({
            queryKey: projectQueryKeys.GetAll(),
            queryFn: () => Project_GetAll(),
        })

        return {
            projects: defer(projects),
        }
    },
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
