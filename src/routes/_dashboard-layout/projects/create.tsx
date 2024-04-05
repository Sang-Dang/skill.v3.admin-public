import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_Create } from '@/api/projects/Project_Create'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import ContentWrapper from '@/common/components/ContentWrapper'
import { DashboardBreadcrumbs } from '@/routes/_dashboard-layout/dashboard/-breadcrumbs'
import { ProjectBreadcrumbs } from '@/routes/_dashboard-layout/projects/-breadcrumbs'
import { ProFormDateRangePicker } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Await, createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Form, Input } from 'antd'
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
            breadcrumbs={[DashboardBreadcrumbs.static.index, ProjectBreadcrumbs.static.index, ProjectBreadcrumbs.static.create]}
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
                                <div className='grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-5'>
                                    <Form.Item<FieldType>
                                        name='projectName'
                                        label='Project Name'
                                        hasFeedback
                                        validateDebounce={500}
                                        validateFirst
                                        className='col-span-2 w-full'
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
                                                validator(_, value) {
                                                    if (projects.data?.find((p) => p.projectName === value)) {
                                                        return Promise.reject('Project name already exists.')
                                                    } else {
                                                        return Promise.resolve()
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Input size='large' />
                                    </Form.Item>
                                    <ProFormDateRangePicker
                                        name='dateRange'
                                        label='Project Timespan'
                                        className='w-full'
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                        tooltip='Please provide the start and end date of the project.'
                                        fieldProps={{
                                            size: 'large',
                                            placeholder: ['Start Date', 'End Date'],
                                            className: 'w-full',
                                        }}
                                        formItemProps={{}}
                                    />
                                </div>
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
