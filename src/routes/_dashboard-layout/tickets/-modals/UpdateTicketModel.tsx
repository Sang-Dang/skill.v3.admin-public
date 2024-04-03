import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Ticket_Update } from '@/api/tickets/Ticket_Update'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import { ProFormDateRangePicker, ProFormMoney, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Form, Modal } from 'antd'
import { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'

type UpdateFormFieldType = {
    ticketName: string
    description: string
    price: number
    duration: Dayjs[]
}

type handleOpenProps = {
    handleOpen: (ticketId: string) => void
}

type Props = {
    children: (props: handleOpenProps) => ReactNode
    afterSuccess?: (id: string) => void
}

export default function UpdateTicketModal({ children, afterSuccess }: Props) {
    const { message, notification } = App.useApp()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [ticketId, setTicketId] = useState<string | undefined>(undefined)
    const [form] = Form.useForm<UpdateFormFieldType>()

    const ticket = useQuery({
        queryKey: ticketsQueryKeys.GetById(ticketId!),
        queryFn: () => Tickets_GetById({ id: ticketId! }),
        enabled: ticketId !== undefined,
        select: (res) => res.data,
    })

    const updateTicket = useMutation({
        mutationFn: Ticket_Update,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Updating Ticket...',
                key: 'msg-update-ticket',
            })
        },
        onSettled: () => {
            message.destroy('msg-update-ticket')
        },
        onSuccess: (res) => {
            notification.success({
                message: 'Ticket Updated Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/tickets/$id',
                                params: {
                                    id: res.data.id,
                                },
                            })
                        }
                    >
                        View Ticket
                    </Button>
                ),
            })
            form.resetFields()
            queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.GetAll() })
            afterSuccess?.(res.data.id)
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Updation Failed, please try again.')
        },
    })

    function handleOpen(ticketId: string) {
        setOpen(true)
        setTicketId(ticketId)
    }

    function handleClose() {
        queryClient.removeQueries({ queryKey: ticketsQueryKeys.GetById(ticketId!) })
        setOpen(false)
        setTicketId(undefined)
        form.resetFields()
    }

    function handleSubmit(values: UpdateFormFieldType) {
        if (ticketId)
            updateTicket.mutate(
                {
                    ...values,
                    startDate: values.duration[0],
                    endDate: values.duration[1],
                    id: ticketId,
                },
                {
                    onSuccess: () => {
                        handleClose()
                    },
                },
            )
        else message.error('Please select a ticket first.')
    }

    useEffect(() => {
        // set form values if ticket is successfully fetched
        if (ticket.isSuccess) {
            form.setFieldsValue({
                ticketName: ticket.data.ticketName,
                description: ticket.data.description,
                price: ticket.data.price,
                duration: [ticket.data.startDate, ticket.data.endDate],
            })
        }
    }, [ticket.isSuccess, ticket.data, form])

    return (
        <>
            {children({ handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                title='Update Ticket'
                footer={[
                    <Button type='default' onClick={handleClose}>
                        Close
                    </Button>,
                    <Button type='primary' loading={updateTicket.isPending} onClick={form.submit}>
                        Update Ticket
                    </Button>,
                ]}
            >
                {ticket.isLoading && <p>Loading...</p>}
                {ticket.isSuccess && (
                    <Form<UpdateFormFieldType>
                        key={ticket.data.id}
                        form={form}
                        name='update-ticket-form'
                        layout='vertical'
                        requiredMark={false}
                        onFinish={handleSubmit}
                    >
                        <ProFormText
                            name='ticketName'
                            label='Ticket Name'
                            placeholder=''
                            rules={[
                                {
                                    type: 'string',
                                    max: 255,
                                    min: 3,
                                    required: true,
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                            }}
                        />
                        <div className='grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-5'>
                            <ProFormDateRangePicker
                                name='duration'
                                label='Ticket Duration'
                                className='w-full'
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                fieldProps={{
                                    size: 'large',
                                    placeholder: ['Start Date', 'End Date'],
                                    className: 'w-full',
                                }}
                                formItemProps={{
                                    rootClassName: 'w-full md:col-span-3 lg:col-span-1',
                                }}
                            />
                            <ProFormMoney
                                customSymbol={'VND'}
                                placeholder=''
                                name='price'
                                label='Price'
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'number',
                                        transform: (value) => Number(value),
                                        min: 0,
                                    },
                                ]}
                                fieldProps={{
                                    size: 'large',
                                }}
                            />
                        </div>
                        <ProFormTextArea
                            name='description'
                            label='Description'
                            className='w-full'
                            rules={[
                                {
                                    type: 'string',
                                    max: 2550,
                                    min: 3,
                                    required: true,
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                            }}
                            placeholder=''
                        />
                    </Form>
                )}
            </Modal>
        </>
    )
}
