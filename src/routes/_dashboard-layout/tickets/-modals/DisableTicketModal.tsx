import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_Disable } from '@/api/tickets/Tickets_Disable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (projectId: string) => void }) => ReactNode
}

export default function DisableTicketModal({ children }: Props) {
    const [id, setId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const disableTicket = useMutation({
        mutationFn: Tickets_Disable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Disabling Ticket...',
                key: 'msg-disable-ticket',
            })
        },
        onSettled: () => {
            message.destroy('msg-disable-ticket')
        },
        onSuccess: () => {
            notification.success({
                message: 'Ticket Disabled Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/tickets/$id',
                                params: {
                                    id: id!,
                                },
                            })
                        }
                    >
                        View Ticket
                    </Button>
                ),
            })
            queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.GetById(id!) })
        },
        onError: (error) => {
            devLog(error)
            message.error('Failed to disable ticket, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => id && disableTicket.mutate({ id })}>
            {({ ho }) =>
                children({
                    handleOpen: (id: string) => {
                        setId(id)
                        ho()
                    },
                })
            }
        </SingleActionModal>
    )
}
