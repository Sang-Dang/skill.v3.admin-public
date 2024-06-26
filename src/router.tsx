import NetworkError from '@/common/pages/DefaultNetworkErrorPage'
import DefaultNotFoundPage from '@/common/pages/DefaultNotFoundPage'
import { AuthHandler } from '@/lib/AuthHandler'
import { routeTree } from '@/routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {},
    },
})

export const authHandler = new AuthHandler()

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
        authHandler,
        queryClient,
    },
    notFoundMode: 'fuzzy',
    defaultNotFoundComponent: () => <DefaultNotFoundPage />,
    defaultErrorComponent: () => <NetworkError />,
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError
    }
}
