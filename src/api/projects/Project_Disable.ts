import { transformRes } from '@/api/utils'
import axios from 'axios'

type Request = {
    id: string
}
type Response = boolean

export async function Project_Disable(req: Request) {
    return axios.delete<Response>(`/project/${req.id}`, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res: SuccessResponse<UpdateResponse>) => res.data.affected > 0,
                    () => false,
                ),
        ],
    })
}
