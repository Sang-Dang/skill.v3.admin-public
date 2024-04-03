import { transformRes } from '@/api/utils'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Request = Pick<ProjectModel, 'projectName' | 'description' | 'startDate' | 'endDate' | 'id'>
type Response = ProjectModel

export async function Project_Update(request: Request) {
    return axios.put<Response>(
        `/project/${encodeURIComponent(request.id)}`,
        {
            ...request,
            startDate: request.startDate.toISOString(),
            endDate: request.endDate.toISOString(),
        },
        {
            transformResponse: [(data) => transformRes(data, (res) => ProjectModel.fromJSON(res.data))],
        },
    )
}
