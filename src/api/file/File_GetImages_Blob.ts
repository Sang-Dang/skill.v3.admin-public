import { File_GetImage_Blob } from '@/api/file/File_GetImage_Blob'

type Request = {
    path: string[]
}
type Response = {
    success: Blob[]
    successIndexes: number[]
    errors: any[]
    errorIndexes: number[]
}

export async function File_GetImages_Blob(req: Request): Promise<Response> {

    if (req.path.length === 0) {
        return {
            success: [],
            successIndexes: [],
            errors: [],
            errorIndexes: [],
        }
    }

    const promises = req.path.map((path) => {
        return File_GetImage_Blob({ path: path })
    })

    const responses = await Promise.allSettled(promises)

    return responses.reduce(
        (acc, curr, index) => {
            if (curr.status === 'fulfilled') {
                return {
                    ...acc,
                    success: [...acc.success, curr.value.data],
                    successIndexes: [...acc.successIndexes, index],
                }
            } else {
                return {
                    ...acc,
                    errors: [...acc.errors, curr.reason],
                    errorIndexes: [...acc.errorIndexes, index],
                }
            }
        },
        {
            success: [],
            successIndexes: [],
            errors: [],
            errorIndexes: [],
        } as Response,
    )
}
