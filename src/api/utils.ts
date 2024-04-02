import { authHandler } from '@/router'
import { redirect } from '@tanstack/react-router'

export function ParseResponse(data: any) {
    if (!data) throw new Error('No data received')
    return JSON.parse(data) as ApiResponse<any>
}

export function transformRes(
    data: any,
    onSuccess: (res: SuccessResponse<any>) => unknown = (res) => res.data,
    onError?: (error: ErrorResponse) => unknown,
) {
    const parsedData = ParseResponse(data)
    if ('data' in parsedData) {
        return onSuccess(parsedData)
    } else {
        if (parsedData.statusCode === 403 || parsedData.statusCode === 401) {
            authHandler.logout()
            throw redirect({
                to: '/',
                search: {
                    error: 'Your session has expired. Please login again.',
                    redirect: window.location.href,
                },
            })
        }
        if (onError)
            onError(parsedData) // used to parse accepted 400 or 500 responses
        else
            throw new Error(
                'Look inside utils.ts Transform Response. Someone fucked up the Response.',
                // if there's an error, then it should be included in the accepted response status code in axios
            )
    }
}

export function withAuth() {
    return {
        Authorization: `Bearer ${authHandler.getToken()}`,
    }
}
