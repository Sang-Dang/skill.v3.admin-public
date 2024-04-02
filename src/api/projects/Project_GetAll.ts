import { transformRes } from '@/api/utils'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Response = ProjectModel[]

export async function Project_GetAll() {
    return axios.get<Response>('/project', {
        transformResponse: [(data) => transformRes(data, (res) => ProjectModel.fromJSONList(res.data))],
    })
}
