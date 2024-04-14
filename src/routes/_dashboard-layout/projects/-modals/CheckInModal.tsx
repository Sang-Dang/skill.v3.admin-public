import { CheckIn_AddRecord } from '@/api/tickets/checkin/CheckIn_AddRecord'
import { ticketCheckInQueryKeys } from '@/api/tickets/checkin/key.query'
import { ticketOrdersQueryKeys } from '@/api/tickets/orders/key.query'
import { TicketOrders_GetAll } from '@/api/tickets/orders/TicketOrders_GetAll'
import NotFoundTemplate from '@/common/components/NotFoundTemplate'
import { AlreadyCheckedInError } from '@/lib/errors/AlreadyCheckedInError'
import { TicketCheckInModel } from '@/lib/model/ticketCheckIn.model'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'
import { App, Button, Descriptions, Flex, Modal } from 'antd'
import { ReactNode, useEffect, useRef, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: () => void }) => ReactNode
}

export default function CheckInModal({ children }: Props) {
    const [open, setOpen] = useState(false)
    const [dataStore, setDataStore] = useState<string | undefined>()
    const [successDataStore, setSuccessDataStore] = useState<TicketCheckInModel | undefined>()
    const navigate = useNavigate()
    const successOrder = useQuery({
        queryKey: ticketOrdersQueryKeys.GetAll(),
        queryFn: TicketOrders_GetAll,
        select: (data) => data.data,
    })
    const { message } = App.useApp()
    const timeoutRef = useRef<number>()
    const queryClient = useQueryClient()

    const checkIn = useMutation({
        mutationFn: CheckIn_AddRecord,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Checking in...',
                key: 'check-in',
            })
        },
        onSettled: () => {
            message.destroy('check-in')
        },
        onError: (error) => {
            if (error instanceof AlreadyCheckedInError) {
                message.error({
                    content: 'Ticket already checked in',
                })
            } else {
                message.error({
                    content: 'Failed to check in',
                })
            }
        },
        onSuccess: (res) => {
            message.success({
                content: 'Checked in successfully',
            })
            queryClient.invalidateQueries({
                queryKey: ticketCheckInQueryKeys.GetAll(),
            })
            setSuccessDataStore(res.data)
        },
    })

    useEffect(() => {
        clearTimeout(timeoutRef.current)

        if (dataStore) {
            timeoutRef.current = window.setTimeout(() => {
                try {
                    const json: {
                        idItem: string
                        idOrder: string
                        id: string
                    } = JSON.parse(dataStore)
                    checkIn.mutate(
                        { idItem: json.idItem, idOrder: json.idOrder },
                        {
                            onSettled: () => {
                                setDataStore(undefined)
                            },
                        },
                    )
                } catch (error) {
                    message.error('Invalid QR code')
                    setDataStore(undefined)
                }
            }, 1000)
        }
    }, [checkIn, dataStore, message])

    function handleOpen() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal open={open} onCancel={handleClose} title='Check In Scanner' footer={null}>
                <Scanner
                    key={String(open)}
                    components={{
                        tracker: true,
                        onOff: true,
                    }}
                    onResult={(text) => {
                        setDataStore(text)
                    }}
                    onError={(error) => {
                        console.log(error)
                        message.error(error.message)
                    }}
                    enabled={!!open}
                />
            </Modal>
            <Modal open={!!successDataStore} onCancel={() => setSuccessDataStore(undefined)} title='Check In Success' footer={null}>
                {successOrder.isSuccess &&
                    successDataStore &&
                    (function () {
                        const order = successOrder.data.find((order) => order.id === successDataStore.idOrder)

                        if (!order) {
                            return <NotFoundTemplate title='Order not found' onBack={() => setOpen(false)} />
                        }

                        const ticket = order.items.find((item) => item.id === successDataStore.idItem)

                        if (!ticket) {
                            return <NotFoundTemplate title='Ticket not found' onBack={() => setOpen(false)} />
                        }

                        return (
                            <>
                                <Descriptions
                                    bordered
                                    className='mt-3'
                                    column={1}
                                    items={[
                                        {
                                            label: 'Ticket',
                                            children: ticket.name,
                                        },
                                        {
                                            label: 'Customer Email',
                                            children: order.email,
                                        },
                                        {
                                            label: 'Customer Phone',
                                            children: order.phone,
                                        },
                                    ]}
                                ></Descriptions>
                                <Flex gap={5} align='center' className='mt-10 w-full'>
                                    <Button
                                        className='w-1/2'
                                        onClick={() =>
                                            navigate({
                                                to: '/tickets/$id',
                                                params: {
                                                    id: ticket.ticket.id,
                                                },
                                            })
                                        }
                                    >
                                        Go to Ticket
                                    </Button>
                                    <Button
                                        className='w-full'
                                        type='primary'
                                        onClick={() =>
                                            navigate({
                                                to: '/tickets/orders/$id',
                                                params: {
                                                    id: order.id,
                                                },
                                            })
                                        }
                                    >
                                        Go to Order
                                    </Button>
                                </Flex>
                            </>
                        )
                    })()}
            </Modal>
        </>
    )
}
