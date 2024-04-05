import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_Undisable } from '@/api/projects/Project_Undisable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (projectId: string) => void }) => ReactNode
}

export default function UndisableProjectModal({ children }: Props) {
    const [projectId, setProjectId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const undisableProject = useMutation({
        mutationFn: Project_Undisable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Re-enabling Project...',
                key: 'msg-reenable-project',
            })
        },
        onSettled: () => {
            message.destroy('msg-reenable-project')
        },
        onSuccess: () => {
            notification.success({
                message: 'Project Re-enabled Successfully!',
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
            message.error('Failed to re-enable project, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => projectId && undisableProject.mutate({ id: projectId })}>
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
