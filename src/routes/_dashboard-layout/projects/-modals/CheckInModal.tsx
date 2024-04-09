import { CheckIn_AddRecord } from '@/api/tickets/checkin/CheckIn_AddRecord'
import { ticketCheckInQueryKeys } from '@/api/tickets/checkin/key.query'
import { AlreadyCheckedInError } from '@/lib/errors/AlreadyCheckedInError'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Scanner } from '@yudiel/react-qr-scanner'
import { App, Modal } from 'antd'
import { ReactNode, useEffect, useRef, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: () => void }) => ReactNode
}

export default function CheckInModal({ children }: Props) {
    const [open, setOpen] = useState(false)
    const [dataStore, setDataStore] = useState<string | undefined>()
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
        onSuccess: () => {
            message.success({
                content: 'Checked in successfully',
            })
            queryClient.invalidateQueries({
                queryKey: ticketCheckInQueryKeys.GetAll(),
            })
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
                    onResult={(text) => {
                        setDataStore(text)
                    }}
                    onError={(error) => {
                        console.log(error)
                        message.error(error.message)
                    }}
                    options={{}}
                    enabled={open}
                />
            </Modal>
        </>
    )
}
