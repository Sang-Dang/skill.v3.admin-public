import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_Create } from '@/api/projects/Project_Create'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import ContentWrapper from '@/common/components/ContentWrapper'
import { useMutation } from '@tanstack/react-query'
import { Await, createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { App, Button, DatePicker, Flex, Form, Input } from 'antd'
import { Dayjs } from 'dayjs'

export const Route = createFileRoute('/_dashboard-layout/projects/create')({
    component: CreateProjectComponent,
    loader: ({ context: { queryClient } }) => {
        const projects = queryClient.ensureQueryData({
            queryKey: projectQueryKeys.GetAll(),
            queryFn: () => Project_GetAll(),
        })

        return {
            projects: defer(projects),
        }
    },
})

type FieldType = {
    projectName: string
    description: string
    dateRange: Dayjs[]
}

function CreateProjectComponent() {
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>()
    const projects = Route.useLoaderData({ select: (res) => res.projects })

    const createProject = useMutation({
        mutationFn: Project_Create,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Creating Project...',
                key: 'msg-create-project',
            })
        },
        onSettled: () => {
            message.destroy('msg-create-project')
        },
        onSuccess: (res) => {
            notification.success({
                message: 'Project Created Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/projects/$id',
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
            form.resetFields()
        },
        onError: (error) => {
            devLog(error)
            message.error('Project Creation Failed, please try again.')
        },
    })

    function handleSubmit(values: FieldType) {
        createProject.mutate({
            ...values,
            startDate: values.dateRange[0],
            endDate: values.dateRange[1],
        })
    }

    return (
        <ContentWrapper
            headTitle='Create Project'
            title='Create Project'
            breadcrumbs={[{ breadcrumbName: 'Home', href: '/dashboard', title: 'Home' }]}
            innerStyle={{ marginBlock: '25px' }}
        >
            <ContentWrapper.ContentCard
                useCard
                cardProps={{
                    title: 'Please fill out the form below to create a new project.',
                }}
            >
                <Form
                    form={form}
                    name='create-account-form'
                    layout='vertical'
                    requiredMark={false}
                    initialValues={{}}
                    onFinish={handleSubmit}
                    className='flex flex-col'
                >
                    <Await promise={projects} fallback={<ContentWrapper.LoadingCard />}>
                        {(projects) => (
                            <>
                                <Flex gap={12}>
                                    <Form.Item<FieldType>
                                        name='projectName'
                                        label='Project Name'
                                        hasFeedback
                                        validateDebounce={500}
                                        validateFirst
                                        className='w-full'
                                        tooltip='This is the name of the project. It must be unique.'
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                min: 3,
                                                max: 255,
                                            },
                                            {
                                                validator(_, value, callback) {
                                                    if (projects.data?.find((p) => p.projectName === value)) {
                                                        callback('Project name already exists.')
                                                    } else {
                                                        callback()
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Input size='large' />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        name='dateRange'
                                        label='Project Timespan'
                                        tooltip='When does the project start and end?'
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker.RangePicker size='large' />
                                    </Form.Item>
                                </Flex>
                                <Form.Item<FieldType>
                                    name='description'
                                    label='Description'
                                    className='flex-grow'
                                    tooltip='Please provide a brief description of the project.'
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            min: 3,
                                            max: 2550,
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={5} />
                                </Form.Item>
                                <Form.Item shouldUpdate className='mb-0 mt-3'>
                                    {() => (
                                        <Flex gap={12}>
                                            <Button type='primary' htmlType='submit' size='large' loading={createProject.isPending}>
                                                Create Project
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