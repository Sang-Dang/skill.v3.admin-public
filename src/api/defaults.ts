import { fromEnv } from "@/config/env.config"
import axios from "axios"

axios.defaults.baseURL = fromEnv.APP_BACKEND_URL
axios.defaults.responseType = "json"
axios.defaults.validateStatus = (status) => {
    switch (status) {
        case 200:
            return true
        case 201:
            return true
        default:
            return false
    }
}

axios.interceptors.request.use(
    (config) => {
        devLog(
            `%cRequest`,
            "font-weight: bold; color: green;",
            ` to ${config.url} (${config.auth ? "🔒" : "🔓"}). ${config.data ? "Payload:" : ""}`,
            config.data ? config.data : ""
        )

        return config
    },
    (error) => {
        devLog(
            "%cError",
            "font-weight: bold; color: red;",
            " while sending request",
            error
        )
        throw error
    }
)

axios.interceptors.response.use(
    (response) => {
        devLog(
            `%cResponse`,
            "font-weight: bold; color: green;",
            ` from ${response.config.url}. ${response.data ? "Response body:" : ""}`,
            response.data ? response.data : ""
        )

        return response
    },
    (error) => {
        devLog(
            "%cError",
            "font-weight: bold; color: red;",
            " while receiving response",
            error
        )
        throw error
    }
)
