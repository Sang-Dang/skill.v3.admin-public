import { transformRes } from '@/api/utils'
import { fileToBinary } from '@/common/util/fileToBinary'
import { FileModel } from '@/lib/model/file.model'
import axios from 'axios'

type Request = {
    file: File
}
type Response = FileModel

export async function File_Upload(req: Request) {
    const formData = new FormData()
    const data = await fileToBinary(req.file)
    formData.append('file', data)

    return axios.post<Response>('/file/upload', formData, {
        transformResponse: [(data) => transformRes(data, (res) => FileModel.fromJSON(res.data))],
    })
}
