import { transformRes } from '@/api/utils'
import { NotFoundError } from '@/lib/errors/NotFoundError'
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
                            throw new NotFoundError('Project not found')
                        }

                        return projectDumbList[0]
                    },
                    (error) => {
                        throw new NotFoundError(error.message)
                    },
                ),
        ],

        validateStatus: (status) => status === 200 || status === 500,
    })
}
