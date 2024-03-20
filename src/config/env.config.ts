import { cleanEnv, str } from "envalid"

export const fromEnv = cleanEnv(import.meta.env, {
    APP_BACKEND_URL: str(),
    MODE: str(),
})
