import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import { Tickets_Create } from '@/api/tickets/Tickets_Create'
import ContentWrapper from '@/common/components/ContentWrapper'
import { ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Await, createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Form } from 'antd'
import { Dayjs } from 'dayjs'

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
}

function CreateTicketComponent() {
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>()
    const projects = Route.useLoaderData({ select: (res) => res.projects })

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
        },
        onError: (error) => {
            devLog(error)
            message.error('Ticket Creation Failed, please try again.')
        },
    })

    function handleSubmit(values: FieldType) {
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
            <ContentWrapper.ContentCard useCard>
                <Form
                    form={form}
                    name='create-account-form'
                    layout='vertical'
                    requiredMark={false}
                    initialValues={{}}
                    onFinish={handleSubmit}
                >
                    <Await promise={projects} fallback={<ContentWrapper.LoadingCard />}>
                        {(projects) => (
                            <>
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
                                    placeholder='Select a project'
                                    fieldProps={{
                                        size: 'large',
                                        showSearch: true,
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
                                <Form.Item shouldUpdate className='mb-0 mt-3'>
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
                            </>
                        )}
                    </Await>
                </Form>
            </ContentWrapper.ContentCard>
        </ContentWrapper>
    )
}
