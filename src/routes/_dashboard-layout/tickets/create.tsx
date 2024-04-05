import { File_GetImage_Url } from '@/api/file/File_GetImage_Url'
import { File_Upload } from '@/api/file/File_Upload'
import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_Create } from '@/api/tickets/Tickets_Create'
import ContentWrapper from '@/common/components/ContentWrapper'
import ImageWithCrop from '@/common/components/ImageWithCrop'
import { CheckImageUrl } from '@/common/util/CheckImageUrl'
import { fromEnv } from '@/config/env.config'
import { ProjectModel } from '@/lib/model/project.model'
import { ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Await, createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Form, Typography } from 'antd'
import { RcFile } from 'antd/es/upload'
import { Dayjs } from 'dayjs'
import { useState } from 'react'

export const Route = createFileRoute('/_dashboard-layout/tickets/create')({
    component: CreateTicketComponent,
    loader: ({ context: { queryClient } }) => {
        const projects = queryClient.fetchQuery({
            queryKey: projectQueryKeys.GetAll(),
            queryFn: () => Project_GetAll(),
        })

        return {
            projects: defer(projects),
        }
    },
})

type FieldType = {
    ticketName: string
    description: string
    price: number
    quantity: number
    duration: Dayjs[]
    project: string
    images: string[]
}

function CreateTicketComponent() {
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>()
    const [projectId, setProjectId] = useState<string | undefined>()
    const projects = Route.useLoaderData({ select: (res) => res.projects })
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
            queryClient.resetQueries({ queryKey: ticketsQueryKeys.GetAll() })
            form.resetFields()
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Creation Failed, please try again.')
        },
    })

    function handleSubmit() {
        const values = form.getFieldsValue(true)
        createTicket.mutate({
            ...values,
            startDate: values.duration[0],
            endDate: values.duration[1],
        })
    }

    return (
        <ContentWrapper
            headTitle='Create Ticket'
            title='Create Ticket'
            breadcrumbs={[{ breadcrumbName: 'Home', href: '/dashboard', title: 'Home' }]}
            innerStyle={{ marginBlock: '25px' }}
        >
            <Form
                form={form}
                name='create-account-form'
                layout='vertical'
                requiredMark={false}
                onFinish={handleSubmit}
                onValuesChange={(_, val) => {
                    console.log(val)
                }}
            >
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <ContentWrapper.ContentCard
                        useCard
                        cardProps={{
                            title: 'Please fill out the form below to create a new ticket.',
                        }}
                    >
                        <Await promise={projects} fallback={<ContentWrapper.LoadingCard />}>
                            {(projects) => {
                                const projectMap = projects.data.reduce(
                                    (acc, project) => {
                                        acc[project.id] = project
                                        return acc
                                    },
                                    {} as Record<string, ProjectModel>,
                                )

                                return (
                                    <>
                                        <ProFormSelect
                                            name='project'
                                            label='Project'
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            options={projects.data.map((project) => ({
                                                label: project.projectName,
                                                value: project.id,
                                            }))}
                                            onChange={(val) => {
                                                setProjectId((val as string) ?? undefined)
                                            }}
                                            placeholder='Select a project'
                                            fieldProps={{
                                                size: 'large',
                                                showSearch: true,
                                            }}
                                        />
                                        <div className='grid grid-cols-1 gap-0 xl:grid-cols-2 xl:gap-5'>
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
                                        </div>
                                        <div className='grid grid-cols-1 gap-0 xl:grid-cols-2 xl:gap-5'>
                                            <ProFormDateRangePicker
                                                shouldUpdate
                                                name='duration'
                                                label='Ticket Duration'
                                                className='w-full'
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                disabled={projectId === undefined}
                                                fieldProps={{
                                                    minDate: projectMap[projectId ?? '']?.startDate,
                                                    maxDate: projectMap[projectId ?? '']?.endDate,
                                                    size: 'large',
                                                    placeholder: ['Start Date', 'End Date'],
                                                    className: 'w-full',
                                                }}
                                                formItemProps={{
                                                    rootClassName: 'w-full',
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
                                    </>
                                )
                            }}
                        </Await>
                    </ContentWrapper.ContentCard>
                    <ContentWrapper.ContentCard
                        useCard
                        cardProps={{
                            title: 'Ticket Images',
                        }}
                    >
                        <Form.Item<FieldType> name='images' rules={[{ required: true }]} shouldUpdate noStyle>
                            <ImageWithCrop
                                name='images'
                                action={fromEnv.APP_BACKEND_URL + 'file/upload'}
                                accept='.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp'
                                customRequest={async (props) => {
                                    const file = props.file as RcFile
                                    const response = await File_Upload({ file })
                                    if (response.status === 201) props.onSuccess?.(response.data.path)
                                    else props.onError?.(new Error('Failed to upload file.'), response)
                                }}
                                showUploadList={true}
                                listType='picture'
                                onChange={(info) => {
                                    form.setFieldsValue({
                                        images: info.fileList.map((file) => file.response),
                                    })
                                }}
                                onPreview={(file) => {
                                    window.open(File_GetImage_Url({ path: file.response }), '_blank')
                                }}
                                multiple={false}
                                maxCount={4}
                                method='POST'
                                isImageUrl={CheckImageUrl}
                                className='w-full'
                            >
                                <div className='flex flex-col items-center justify-center'>
                                    <Typography.Title level={5}>Click here</Typography.Title>
                                    <Typography.Text type='secondary'>Please upload a ticket image.</Typography.Text>
                                </div>
                            </ImageWithCrop>
                        </Form.Item>
                    </ContentWrapper.ContentCard>
                </div>
                <ContentWrapper.ContentCard
                    useCard
                    cardProps={{
                        style: {
                            marginTop: 10,
                        },
                    }}
                >
                    <Form.Item shouldUpdate noStyle>
                        {() => (
                            <Flex gap={12}>
                                <Button type='primary' htmlType='submit' size='large' loading={createTicket.isPending}>
                                    Create Ticket
                                </Button>
                                <Button
                                    type='default'
                                    size='large'
                                    onClick={() => {
                                        form.resetFields()
                                        message.success('Form data reset to defaults.')
                                    }}
                                    disabled={!form.isFieldsTouched()}
                                >
                                    Clear
                                </Button>
                            </Flex>
                        )}
                    </Form.Item>
                </ContentWrapper.ContentCard>
            </Form>
        </ContentWrapper>
    )
}
