import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_Undisable } from '@/api/tickets/Tickets_Undisable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (id: string) => void }) => ReactNode
}

export default function UndisableTicketModal({ children }: Props) {
    const [id, setId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const undisableTicket = useMutation({
        mutationFn: Tickets_Undisable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Re-enabling Ticket...',
                key: 'msg-reenable-ticket',
            })
        },
        onSettled: () => {
            message.destroy('msg-reenable-ticket')
        },
        onSuccess: () => {
            notification.success({
                message: 'Ticket Re-enabled Successfully!',
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
            message.error('Failed to re-enable ticket, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => id && undisableTicket.mutate({ id })}>
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
