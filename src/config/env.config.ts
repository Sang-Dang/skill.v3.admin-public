import { cleanEnv, str } from "envalid"

export const fromEnv = cleanEnv(import.meta.env, {
    APP_BACKEND_URL: str(),
    APP_FB_API_KEY: str(),
    APP_FB_AUTH_DOMAIN: str(),
    APP_FB_PROJECT_ID: str(),
    APP_FB_STORAGE_BUCKET: str(),
    APP_FB_MESSAGING_SENDER_ID: str(),
    APP_FB_APP_ID: str(),
    MODE: str(),
})
