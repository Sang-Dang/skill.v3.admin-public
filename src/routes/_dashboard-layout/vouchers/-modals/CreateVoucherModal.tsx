import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_Create } from '@/api/tickets/voucher/TicketVoucher_Create'
import { TicketVoucher_GetAllByProjectId } from '@/api/tickets/voucher/TicketVoucher_GetAllByProjectId'
import { ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Form, Modal } from 'antd'
import { Dayjs } from 'dayjs'
import { ReactNode, useState } from 'react'

type CreateFormFieldType = {
    voucherName: string
    description: string
    price: number
    quantity: number
    note: string
    applyTicketId: string[]
    duration: Dayjs[]
}

type handleOpenProps = {
    handleOpen: (projectId: string) => void
}

type Props = {
    children: (props: handleOpenProps) => ReactNode
}

export default function CreateVoucherModal({ children }: Props) {
    const [open, setOpen] = useState(false)
    const [projectId, setProjectId] = useState<string | undefined>(undefined)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<CreateFormFieldType>()
    const queryClient = useQueryClient()

    const createVoucher = useMutation({
        mutationFn: TicketVoucher_Create,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Creating Voucher...',
                key: 'msg-create-voucher',
            })
        },
        onSettled: () => {
            message.destroy('msg-create-voucher')
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ticketVoucherQueryKeys.GetAll() })
        },
        onError: (error) => {
            devLog(error)
            message.error('Voucher Creation Failed, please try again.')
        },
    })

    function handleOpen(projectId: string) {
        setProjectId(projectId)
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
        setProjectId(undefined)
        form.resetFields()
    }

    function handleSubmit() {
        const values = form.getFieldsValue(true)
        createVoucher.mutate(
            {
                ...values,
                project: projectId,
                startDate: values.duration[0],
                endDate: values.duration[1],
            },
            {
                onSuccess: (res) => {
                    notification.success({
                        message: 'Voucher Created Successfully!',
                        description: (
                            <Button
                                onClick={() =>
                                    navigate({
                                        to: '/vouchers/$id',
                                        params: {
                                            id: res.data.id,
                                        },
                                    })
                                }
                            >
                                View Project
                            </Button>
                        ),
                    })
                    handleClose()
                },
            },
        )
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                title='Create Voucher'
                width={800}
                footer={[
                    <Button type='default' onClick={handleClose}>
                        Close
                    </Button>,
                    <Button type='primary' loading={createVoucher.isPending} onClick={form.submit}>
                        Create Voucher
                    </Button>,
                ]}
            >
                <Form form={form} name='create-voucher-form' layout='vertical' requiredMark={false} onFinish={handleSubmit}>
                    <ProFormSelect
                        name='applyTicketId'
                        label='Tickets'
                        tooltip='Select the tickets to apply this voucher to. (Leave empty to apply to all tickets)'
                        mode='multiple'
                        request={async () => {
                            const res = await Tickets_GetAllByProjectId({ projectId: projectId! })
                            return res.data.map((ticket) => ({ label: ticket.ticketName, value: ticket.id }))
                        }}
                        placeholder='Select Tickets'
                    />
                    <ProFormText
                        name={'voucherCode'}
                        label='Voucher Code'
                        placeholder='ABCDE'
                        tooltip='A unique code that users can use to redeem the voucher'
                        rules={[
                            {
                                required: true,
                                message: 'Please enter voucher code',
                            },
                            {
                                min: 3,
                                max: 255,
                                message: 'Voucher code must be between 3 and 255 characters',
                            },
                            {
                                async validator(_, value) {
                                    const vouchers = await TicketVoucher_GetAllByProjectId({ projectId: projectId! })

                                    if (vouchers.data.find((v) => v.voucherCode === value) !== undefined) {
                                        return Promise.reject('Voucher code already exists')
                                    } else {
                                        return Promise.resolve()
                                    }
                                },
                            },
                        ]}
                        formItemProps={{
                            validateDebounce: 500,
                            validateFirst: true,
                            hasFeedback: true,
                        }}
                        fieldProps={{
                            size: 'large',
                        }}
                    />
                    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                        <ProFormMoney
                            customSymbol={'VND'}
                            placeholder='VND 0'
                            tooltip='The amount of discount (VND) that will be applied to the ticket'
                            name='discount'
                            label='Discount'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter voucher code',
                                },
                                {
                                    type: 'number',
                                    transform: (value) => Number(value),
                                    min: 0,
                                    message: 'Discount must be a number',
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                            }}
                        />
                        <ProFormDigit
                            name='quantity'
                            label='Quantity'
                            tooltip='The number of vouchers that will be created'
                            placeholder={'0'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter quantity',
                                },
                                {
                                    type: 'number',
                                    transform: (value) => Number(value),
                                    min: 0,
                                    message: 'Quantity must be a number',
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                                suffix: 'Vouchers',
                            }}
                        />
                        <ProFormDateRangePicker
                            name='duration'
                            label='Duration'
                            tooltip='From when to when can the voucher be applied?'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter voucher duration',
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
                    </div>
                    <ProFormTextArea
                        name='note'
                        label='Note'
                        tooltip='Add a note to the voucher for additional admin-only informations'
                        placeholder='Note'
                        fieldProps={{
                            size: 'large',
                        }}
                    />
                </Form>
            </Modal>
        </>
    )
}
