import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_Create } from '@/api/tickets/Tickets_Create'
import { ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Form, Modal } from 'antd'
import { Dayjs } from 'dayjs'
import { ReactNode, useState } from 'react'

type CreateFormFieldType = {
    ticketName: string
    description: string
    price: number
    quantity: number
    duration: Dayjs[]
}

type handleOpenProps = {
    handleOpen: (projectId: string) => void
}

type Props = {
    children: (props: handleOpenProps) => ReactNode
    afterSuccess?: (id: string) => void
}

export default function CreateTicketModal({ children, afterSuccess }: Props) {
    const [open, setOpen] = useState(false)
    const [projectId, setProjectId] = useState<string | undefined>(undefined)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<CreateFormFieldType>()
    const queryClient = useQueryClient()

    const createTicket = useMutation({
        mutationFn: Tickets_Create,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Creating Ticket...',
                key: 'msg-create-ticket',
            })
        },
        onSettled: () => {
            message.destroy('msg-create-ticket')
        },
        onSuccess: (res) => {
            notification.success({
                message: 'Ticket Created Successfully!',
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
            // project ID cannot be null
            queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.GetAll() })
            afterSuccess?.(res.data.id)
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Creation Failed, please try again.')
        },
    })

    function handleOpen(projectId: string) {
        setOpen(true)
        setProjectId(projectId)
    }

    function handleClose() {
        setOpen(false)
        form.resetFields()
    }

    function handleSubmit(values: CreateFormFieldType) {
        if (projectId)
            createTicket.mutate(
                {
                    ...values,
                    startDate: values.duration[0],
                    endDate: values.duration[1],
                    project: projectId,
                },
                {
                    onSuccess: () => {
                        handleClose()
                    },
                },
            )
        else message.error('Please select a project first.')
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                title='Create Ticket'
                footer={[
                    <Button type='default' onClick={handleClose}>
                        Close
                    </Button>,
                    <Button type='primary' loading={createTicket.isPending} onClick={form.submit}>
                        Create Ticket
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    name='create-account-form'
                    layout='vertical'
                    requiredMark={false}
                    initialValues={{}}
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
                    <Flex gap={24}>
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
                        <ProFormDigit
                            name='quantity'
                            label='Quantity'
                            fieldProps={{
                                size: 'large',
                            }}
                            placeholder=''
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
                        />
                    </Flex>
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
            </Modal>
        </>
    )
}
