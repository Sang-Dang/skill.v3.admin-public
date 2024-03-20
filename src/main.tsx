import "@/api/defaults"
import "@/config/env.config"; // Load env files. MUST BE TOP LEVEL
// Seperator. DO NOT REMOVE
import { fromEnv } from "@/config/env.config"
import "@/index.css"
import "@/styles/reset.css"
import { router } from "@/router"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"

// #region devlog
const _global = (window /* browser */ || global) /* node */ as any
declare global {
    function devLog(...msg: any[]): void
}
_global.devLog = function (...msg: any[]) {
    if (import.meta.env.MODE === "development") {
        console.log("%c[DEV MODE]", "font-weight: bold; color: red;", ...msg)
    }
}
// #endregion

fromEnv.MODE === "development" && devLog(`App is running in Development Mode`)

const rootElement = document.getElementById("root")

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
} else {
    throw new Error("No root element found")
}
