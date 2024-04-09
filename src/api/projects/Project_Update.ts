import { transformRes } from '@/api/utils'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Request = Partial<Pick<ProjectModel, 'projectName' | 'description' | 'startDate' | 'endDate'>> & Pick<ProjectModel, 'id'>
type Response = ProjectModel

export async function Project_Update(request: Request) {
    return axios.put<Response>(
        `/project/${encodeURIComponent(request.id)}`,
        {
            ...request,
            startDate: request.startDate?.toISOString() || undefined,
            endDate: request.endDate?.toISOString() || undefined,
        },
        {
            transformResponse: [(data) => transformRes(data, (res) => ProjectModel.fromJSON(res.data))],
        },
    )
}
