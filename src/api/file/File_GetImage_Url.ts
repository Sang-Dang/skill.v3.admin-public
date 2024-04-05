import { fromEnv } from '@/config/env.config'

type Request = {
    path: string
}

export function File_GetImage_Url(req: Request) {
    return fromEnv.APP_BACKEND_URL + `file/image/${req.path}`
}
