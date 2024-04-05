import { transformRes } from '@/api/utils'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Response = ProjectModel[]

export async function Project_GetAllDisabled() {
    return axios.get<Response>('/project', {
        transformResponse: [
            (data) => transformRes(data, (res) => ProjectModel.fromJSONList(res.data)),
            (data) => data.filter((project: ProjectModel) => project.deletedAt !== null),
        ],
    })
}
