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

declare type UpdateResponse = {
    generatedMaps: any[]
    raw: any[]
    affected: number
}

declare type Token = {
    token: string
}

declare type WithToken<T> = {
    token: string
    payload: T
}

declare type TableData<T> =
    | {
          list: T[]
          total: number
      }
    | undefined