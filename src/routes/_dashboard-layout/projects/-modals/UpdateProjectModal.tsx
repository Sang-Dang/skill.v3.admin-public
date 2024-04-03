import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import { Project_GetById } from '@/api/projects/Project_GetById'
import { Project_Update } from '@/api/projects/Project_Update'
import ContentWrapper from '@/common/components/ContentWrapper'
import { ProFormDateRangePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Form, Modal } from 'antd'
import { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'

type UpdateFormFieldType = {
    projectName: string
    description: string
    duration: Dayjs[]
}

type handleOpenProps = {
    handleOpen: (projectId: string) => void
}

type Props = {
    children: (props: handleOpenProps) => ReactNode
    afterSuccess?: (id: string) => void
}

export default function UpdateProjectModal({ children, afterSuccess }: Props) {
    const { message, notification } = App.useApp()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [projectId, setProjectId] = useState<string | undefined>(undefined)
    const [form] = Form.useForm<UpdateFormFieldType>()

    const project = useQuery({
        queryKey: projectQueryKeys.GetById(projectId!),
        queryFn: () => Project_GetById({ id: projectId! }),
        enabled: !!projectId,
        select: (res) => res.data,
    })

    const updateProject = useMutation({
        mutationFn: Project_Update,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Updating Project...',
                key: 'msg-update-project',
            })
        },
        onSettled: () => {
            message.destroy('msg-update-project')
        },
        onSuccess: (res) => {
            notification.success({
                message: 'Project Updated Successfully!',
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
                        View Project
                    </Button>
                ),
            })
            form.resetFields()
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.GetById(projectId!) })
            afterSuccess?.(res.data.id)
        },
        onError: (error) => {
            devLog(error)
            message.error('Project Updation Failed, please try again.')
        },
    })

    function handleOpen(projectId: string) {
        setOpen(true)
        setProjectId(projectId)
    }

    function handleClose() {
        setOpen(false)
        setProjectId(undefined)
        form.resetFields()
    }

    function handleSubmit(values: UpdateFormFieldType) {
        if (projectId)
            updateProject.mutate(
                {
                    ...values,
                    startDate: values.duration[0],
                    endDate: values.duration[1],
                    id: projectId,
                },
                {
                    onSuccess: () => {
                        handleClose()
                    },
                },
            )
        else message.error('Please select a project first.')
    }

    useEffect(() => {
        if (project.isSuccess) {
            form.setFieldsValue({
                projectName: project.data.projectName,
                description: project.data.description,
                duration: [project.data.startDate, project.data.endDate],
            })
        }
    }, [project.isSuccess, project.data?.projectName, project.data?.description, project.data?.startDate, project.data?.endDate, form])

    return (
        <>
            {children({ handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                title='Update Project'
                footer={[
                    <Button type='default' onClick={handleClose}>
                        Close
                    </Button>,
                    <Button type='primary' loading={updateProject.isPending} onClick={form.submit}>
                        Update Project
                    </Button>,
                ]}
                width={1000}
            >
                {project.isLoading && <ContentWrapper.LoadingCard />}
                {project.isSuccess && (
                    <Form<UpdateFormFieldType>
                        form={form}
                        name='update-project-form'
                        layout='vertical'
                        requiredMark={false}
                        onFinish={handleSubmit}
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-5'>
                            <ProFormText
                                name='projectName'
                                label='Project Name'
                                placeholder=''
                                initialValue={project.data.projectName}
                                tooltip='This is the name of the project. It must be unique.'
                                formItemProps={{
                                    validateDebounce: 1000,
                                    validateFirst: true,
                                    hasFeedback: true,
                                    className: 'col-span-2',
                                }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        min: 3,
                                        max: 255,
                                    },
                                    {
                                        async validator(_, value) {
                                            const projects = await Project_GetAll()

                                            if (projects.data.find((p) => p.projectName === value)) {
                                                return Promise.reject('Project name already exists.')
                                            } else {
                                                return Promise.resolve()
                                            }
                                        },
                                    },
                                ]}
                                fieldProps={{
                                    size: 'large',
                                }}
                            />
                            <ProFormDateRangePicker
                                name='duration'
                                label='Project Duration'
                                className='w-full'
                                tooltip='When does the project start and end?'
                                initialValue={[project.data.startDate, project.data.endDate]}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                fieldProps={{
                                    size: 'large',
                                    className: 'w-full',
                                    placeholder: ['Start Date', 'End Date'],
                                }}
                            />
                        </div>
                        <ProFormTextArea
                            name='description'
                            label='Description'
                            tooltip='Please provide a brief description of the project.'
                            className='w-full'
                            initialValue={project.data.description}
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
