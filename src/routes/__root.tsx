import { AuthHandler } from "@/lib/AuthHandler"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { App, ConfigProvider } from "antd"

type RootContext = {
    authHandler: AuthHandler
}

export const Route = createRootRouteWithContext<RootContext>()({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ConfigProvider>
            <App style={{
                height: '100%'
            }}>
                <Outlet />
            </App>
        </ConfigProvider>
    )
}
