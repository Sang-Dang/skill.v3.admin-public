import { AuthHandler } from '@/lib/AuthHandler'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { App, ConfigProvider } from 'antd'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient } from '@tanstack/react-query'
import { AuthContextProvider } from '@/common/context/AuthContext'
import { authHandler } from '@/router'
import { Suspense } from 'react'
import { enUSIntl } from '@ant-design/pro-components'
import React from 'react'

const TanStackRouterDevtools =
    process.env.NODE_ENV === 'production'
        ? () => null // Render nothing in production
        : React.lazy(() =>
              // Lazy load in development
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools,
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              })),
          )

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
            <ConfigProvider
                theme={{
                    components: {
                        Button: {},
                    },
                }}
                locale={enUSIntl}
            >
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
