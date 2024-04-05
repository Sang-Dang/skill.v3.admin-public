import axios from 'axios'

type Request = {
    path: string
}
type Response = Blob

export async function File_GetImage_Blob(req: Request) {
    return axios.get<Response>(`file/image/${req.path}`, {
        responseType: 'blob',
        validateStatus: (status) => status === 200,
    })
}
