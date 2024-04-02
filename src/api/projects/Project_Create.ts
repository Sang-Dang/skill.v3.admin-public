import { transformRes } from '@/api/utils'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Request = Pick<ProjectModel, 'projectName' | 'description' | 'startDate' | 'endDate'>
type Response = ProjectModel

export async function Project_Create(req: Request) {
    return axios.post<Response>('/project', req, {
        transformResponse: [(data) => transformRes(data, (res) => ProjectModel.fromJSON(res.data))],
    })
}
