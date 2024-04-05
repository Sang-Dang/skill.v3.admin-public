import { File_GetImages_Blob } from '@/api/file/File_GetImages_Blob'
import { File_Upload } from '@/api/file/File_Upload'
import { fileQueryKeys } from '@/api/file/key.query'
import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_Create } from '@/api/tickets/Tickets_Create'
import { Tickets_GetById } from '@/api/tickets/Tickets_GetById'
import { Tickets_Update } from '@/api/tickets/Tickets_Update'
import ImageWithCrop from '@/common/components/ImageWithCrop'
import { CheckImageUrl } from '@/common/util/CheckImageUrl'
import { FileImageFilled } from '@ant-design/icons'
import { ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Form, Modal, Skeleton, Typography } from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload'
import { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'

type FieldType = {
    ticketName: string
    description: string
    price: number
    quantity: number
    duration: Dayjs[]
    images: UploadFile<string>[]
}

type handleOpenProps = {
    handleOpenCreate: (projectId: string) => void
    handleOpenUpdate: (ticketId: string) => void
}

type Props = {
    children: (props: handleOpenProps) => ReactNode
}

export default function CreateOrUpdateTicketModal({ children }: Props) {
    const [open, setOpen] = useState(false)
    const [projectId, setProjectId] = useState<string | undefined>(undefined)
    const [ticketId, setTicketId] = useState<string | undefined>(undefined)
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>()
    const queryClient = useQueryClient()
    const [fileList, setFileList] = useState<UploadFile<string>[]>([])

    const ticket = useQuery({
        queryKey: ticketsQueryKeys.GetById(ticketId!),
        queryFn: () => Tickets_GetById({ id: ticketId! }),
        enabled: ticketId !== undefined,
        select: (res) => res.data,
    })

    const project = useQuery({
        queryKey: projectQueryKeys.GetById(projectId!),
        queryFn: () => Project_GetById({ id: projectId! }),
        enabled: projectId !== undefined,
        select: (res) => res.data,
    })

    const images = useQuery({
        queryKey: fileQueryKeys.GetImagesByPath(ticket.data?.images),
        queryFn: () => File_GetImages_Blob({ path: ticket.data?.images ?? [] }),
        enabled: ticket.isSuccess && ticket.data.images.length > 0,
    })

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
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Creation Failed, please try again.')
        },
    })

    const updateTicket = useMutation({
        mutationFn: Tickets_Update,
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
            // project ID cannot be null
            queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.GetAll() })
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Updation Failed, please try again.')
        },
    })

    useEffect(() => {
        if (ticket.isSuccess) {
            form.setFieldsValue({
                ticketName: ticket.data.ticketName,
                description: ticket.data.description,
                price: ticket.data.price,
                quantity: ticket.data.quantity,
                duration: [ticket.data.startDate, ticket.data.endDate],
            })
            setProjectId(ticket.data.project)
        }
    }, [form, ticket.data, ticket.isSuccess])

    useEffect(() => {
        if (images.isSuccess && ticket.isSuccess) {
            setFileList(
                images.data.success.map((blob, index) => ({
                    uid: `fetched-image-#${index}`,
                    name: `Fetched Image #${index}`,
                    status: 'done',
                    url: URL.createObjectURL(blob),
                    response: ticket.data.images[images.data.successIndexes[index]],
                })),
            )
        }
    }, [form, images.data, images.isSuccess, ticket.data, ticket.isSuccess])

    function handleOpenCreate(projectId: string) {
        setOpen(true)
        setProjectId(projectId)
    }

    function handleOpenUpdate(ticketId: string) {
        setOpen(true)
        setTicketId(ticketId)
    }

    function handleClose() {
        setOpen(false)
        setProjectId(undefined)
        setTicketId(undefined)
        setFileList([])
        form.resetFields()
    }

    function handleSubmit() {
        if (!projectId) throw new Error('Project ID cannot be null')
        const values = form.getFieldsValue(true)

        if (ticketId) {
            return updateTicket.mutate(
                {
                    ...values,
                    startDate: values.duration[0],
                    endDate: values.duration[1],
                    id: ticketId,
                    images: values.images.map((image: UploadFile<string>) => image.response),
                },
                {
                    onSuccess: () => {
                        handleClose()
                    },
                },
            )
        } else {
            return createTicket.mutate(
                {
                    ...values,
                    startDate: values.duration[0],
                    endDate: values.duration[1],
                    project: projectId,
                    images: values.images.map((image: UploadFile<string>) => image.response),
                },
                {
                    onSuccess: () => {
                        handleClose()
                    },
                },
            )
        }
    }

    return (
        <>
            {children({ handleOpenCreate, handleOpenUpdate })}
            <Modal
                open={open}
                onCancel={handleClose}
                title={ticketId ? 'Update Ticket' : 'Create Ticket'}
                width={1000}
                footer={[
                    <Button type='default' onClick={handleClose}>
                        Close
                    </Button>,
                    <Button type='primary' loading={createTicket.isPending} onClick={form.submit}>
                        {ticketId ? 'Update' : 'Create'}
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
                    onValuesChange={(_, val) => {
                        devLog(val)
                    }}
                >
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        <div>
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
                            <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5'>
                                <div>
                                    {project.isSuccess ? (
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
                                                minDate: project.data.startDate,
                                                maxDate: project.data.endDate,
                                                size: 'large',
                                                className: 'w-full',
                                                placeholder: ['Start Date', 'End Date'],
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {project.isPending && <Skeleton.Input style={{ width: '100%', height: 40 }} active={true} />}
                                            {project.isError && (
                                                <Typography.Text type='danger'>Failed to load project data.</Typography.Text>
                                            )}
                                        </>
                                    )}
                                </div>
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
                        </div>
                        {images.isSuccess || ticketId === undefined ? (
                            <Form.Item<FieldType> shouldUpdate name='images' rules={[{ required: true }]} noStyle>
                                <ImageWithCrop
                                    name='image'
                                    accept='.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp'
                                    customRequest={async (props) => {
                                        const file = props.file as RcFile
                                        const response = await File_Upload({ file })
                                        if (response.status === 201) {
                                            props.onSuccess?.(response.data.path)
                                        } else props.onError?.(new Error('Failed to upload file.'), response)
                                    }}
                                    onChange={(info) => {
                                        form.setFieldsValue({
                                            images: info.fileList,
                                        })
                                        setFileList(info.fileList)
                                    }}
                                    fileList={fileList}
                                    showUploadList={true}
                                    listType='picture'
                                    multiple={false}
                                    maxCount={4}
                                    method='POST'
                                    isImageUrl={CheckImageUrl}
                                    className='h-max w-full'
                                >
                                    <div className='flex flex-col items-center justify-center'>
                                        <FileImageFilled className='text-2xl text-blue-500' />
                                        <Typography.Title level={5}>Ticket Image</Typography.Title>
                                        <Typography.Text type='secondary'>Please upload a ticket image.</Typography.Text>
                                    </div>
                                </ImageWithCrop>
                            </Form.Item>
                        ) : (
                            <>
                                {images.isPending && <Skeleton.Image style={{ width: '100%', height: 200 }} />}
                                {images.isError && <Typography.Text type='danger'>Failed to load ticket images.</Typography.Text>}
                            </>
                        )}
                    </div>
                </Form>
            </Modal>
        </>
    )
}
