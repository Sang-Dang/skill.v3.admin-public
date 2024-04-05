import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_Disable } from '@/api/projects/Project_Disable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (projectId: string) => void }) => ReactNode
}

export default function DisableProjectModal({ children }: Props) {
    const [projectId, setProjectId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const disableProject = useMutation({
        mutationFn: Project_Disable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Disabling Project...',
                key: 'msg-disable-project',
            })
        },
        onSettled: () => {
            message.destroy('msg-disable-project')
        },
        onSuccess: () => {
            notification.success({
                message: 'Project Disabled Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/projects/$id',
                                params: {
                                    id: projectId!,
                                },
                            })
                        }
                    >
                        View Project
                    </Button>
                ),
            })
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.GetById(projectId!) })
        },
        onError: (error) => {
            devLog(error)
            message.error('Failed to disable project, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => projectId && disableProject.mutate({ id: projectId })}>
            {({ ho }) =>
                children({
                    handleOpen: (projectId: string) => {
                        setProjectId(projectId)
                        ho()
                    },
                })
            }
        </SingleActionModal>
    )
}
