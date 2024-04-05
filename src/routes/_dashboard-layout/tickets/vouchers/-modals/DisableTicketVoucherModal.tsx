import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_Disable } from '@/api/tickets/voucher/TicketVoucher_Disable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (id: string) => void }) => ReactNode
}

export default function DisableTicketVoucherModal({ children }: Props) {
    const [id, setId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const disableTicketVoucher = useMutation({
        mutationFn: TicketVoucher_Disable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Disabling Ticket Voucher...',
                key: 'msg-disable-ticketvoucher',
            })
        },
        onSettled: () => {
            message.destroy('msg-disable-ticketvoucher')
        },
        onSuccess: () => {
            notification.success({
                message: 'Ticket Voucher Disabled Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/tickets/vouchers/$id',
                                params: {
                                    id: id!,
                                },
                            })
                        }
                    >
                        View Ticket Voucher
                    </Button>
                ),
            })
            queryClient.invalidateQueries({ queryKey: ticketVoucherQueryKeys.GetById(id!) })
        },
        onError: (error) => {
            devLog(error)
            message.error('Failed to disable ticket voucher, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => id && disableTicketVoucher.mutate({ id })}>
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
