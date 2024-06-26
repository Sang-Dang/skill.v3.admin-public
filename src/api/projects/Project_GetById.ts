import { transformRes } from '@/api/utils'
import { ResourceNotFoundError } from '@/lib/errors/ResourceNotFoundError'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'

type Request = Pick<ProjectModel, 'id'>
type Response = ProjectModel

export async function Project_GetById(req: Request) {
    return axios.get<Response>(`/project/${req.id}`, {
        transformResponse: [
            (data) =>
                transformRes(
                    data,
                    (res) => {
                        const projectDumbList = ProjectModel.fromJSONList(res.data)

                        if (projectDumbList.length === 0) {
                            throw new ResourceNotFoundError('Project not found')
                        }

                        return projectDumbList[0]
                    },
                    (error) => {
                        throw new ResourceNotFoundError(error.message)
                    },
                ),
        ],

        validateStatus: (status) => status === 200 || status === 500,
    })
}
