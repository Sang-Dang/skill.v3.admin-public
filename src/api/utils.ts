export function ParseResponse(data: any) {
    if (!data) throw new Error("No data received")
    return JSON.parse(data) as ApiResponse<any>
}

export function transformRes(
    data: any,
    onSuccess: (data: SuccessResponse<any>) => unknown = (data) => data.data,
    onError?: (error: ErrorResponse) => unknown
) {
    const parsedData = ParseResponse(data)
    if ("data" in parsedData) {
        onSuccess(data)
    } else {
        if (onError)
            onError(parsedData) // used to parse accepted 400 or 500 responses
        else
            throw new Error(
                "Look inside utils.ts Transform Response. Someone fucked up the Response."
                // if there's an error, then it should be included in the accepted response status code in axios
            )
    }
}
