declare type SuccessResponse<T> = {
    data: T
    message: string
    statusCode: 200 | 201 | 204
}

declare type ErrorResponse = {
    message: any
    statusCode: number
}

declare type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
