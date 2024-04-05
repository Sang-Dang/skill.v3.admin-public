import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_Undisable } from '@/api/tickets/voucher/TicketVoucher_Undisable'
import SingleActionModal from '@/common/components/SingleActionModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: (id: string) => void }) => ReactNode
}

export default function UndisableTicketVoucherModal({ children }: Props) {
    const [id, setId] = useState<string | null>(null)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const undisableTicketVoucher = useMutation({
        mutationFn: TicketVoucher_Undisable,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Re-enabling Ticket Voucher...',
                key: 'msg-reenable-ticketvoucher',
            })
        },
        onSettled: () => {
            message.destroy('msg-reenable-ticketvoucher')
        },
        onSuccess: () => {
            notification.success({
                message: 'Ticket Voucher Re-enabled Successfully!',
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
            message.error('Failed to re-enable ticket voucher, please try again.')
        },
    })

    return (
        <SingleActionModal onOk={() => id && undisableTicketVoucher.mutate({ id })}>
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
