import { AuthHandler } from '@/lib/AuthHandler'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { App, ConfigProvider } from 'antd'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { AuthContextProvider } from '@/common/context/AuthContext'
import { authHandler } from '@/router'
import { Suspense } from 'react'

type RootContext = {
    authHandler: AuthHandler
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootContext>()({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <Suspense>
                <ReactQueryDevtools initialIsOpen={false} position='right' />
                <TanStackRouterDevtools initialIsOpen={false} position='bottom-right' />
            </Suspense>
            <ConfigProvider>
                <App
                    notification={{
                        placement: 'bottomRight',
                        duration: 5,
                        maxCount: 3,
                        stack: {
                            threshold: 0.5,
                        },
                    }}
                    style={{
                        height: '100%',
                    }}
                >
                    <AuthContextProvider authHandler={authHandler}>
                        <Outlet />
                    </AuthContextProvider>
                </App>
            </ConfigProvider>
        </>
    )
}
