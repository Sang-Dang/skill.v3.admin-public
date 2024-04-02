import { transformRes } from '@/api/utils'
import { ProjectStatus } from '@/lib/enum/project-status.enum'
import { ProjectModel } from '@/lib/model/project.model'
import axios from 'axios'
import dayjs from 'dayjs'

type Request = {
    status: ProjectStatus
}
type Response = ProjectModel[]

export async function Project_GetAllByStatus(req: Request) {
    return axios.get<Response>('/project', {
        transformResponse: [
            (data) => transformRes(data, (res) => ProjectModel.fromJSONList(res.data)),
            (res) => {
                let data
                const now = dayjs()

                switch (req.status) {
                    case ProjectStatus.RUNNING:
                        data = res.filter((project: ProjectModel) => project.startDate.isBefore(now) && project.endDate.isAfter(now))
                        break
                    case ProjectStatus.ARCHIVED:
                        data = res.filter((project: ProjectModel) => project.endDate.isBefore(now))
                        break
                    case ProjectStatus.FUTURE:
                        data = res.filter((project: ProjectModel) => project.startDate.isAfter(now))
                        break
                    default:
                        data = res
                }

                return data
            },
        ],
    })
}
