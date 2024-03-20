import { AuthHandler } from "@/lib/AuthHandler"
import { routeTree } from "@/routeTree.gen"
import { createRouter } from "@tanstack/react-router"

export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
        authHandler: new AuthHandler(),
    },
    notFoundMode: 'fuzzy'
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}
