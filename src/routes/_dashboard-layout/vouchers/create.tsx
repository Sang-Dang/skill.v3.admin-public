import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import { ticketsQueryKeys } from '@/api/tickets/key.query'
import { Tickets_GetAllByProjectId } from '@/api/tickets/Tickets_GetAllByProjectId'
import { ticketVoucherQueryKeys } from '@/api/tickets/voucher/key.query'
import { TicketVoucher_Create } from '@/api/tickets/voucher/TicketVoucher_Create'
import { TicketVoucher_GetAllByProjectId } from '@/api/tickets/voucher/TicketVoucher_GetAllByProjectId'
import ContentWrapper from '@/common/components/ContentWrapper'
import ModalWrapper from '@/common/components/ModalWrapper'
import RefreshButton from '@/common/components/ReloadButton'
import CreateVoucherSuccess from '@/routes/_dashboard-layout/vouchers/-components/CreateVoucherSuccess'
import { InfoCircleFilled, PlusOutlined } from '@ant-design/icons'
import { CheckCard, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { App, Avatar, Button, Card, Flex, Form, Input, Pagination, Steps, Tooltip, Typography } from 'antd'
import { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_dashboard-layout/vouchers/create')({
    component: CreateVoucherComponent,
    validateSearch: z.object({
        step: z.number().min(0).optional(),
    }),
})

type FieldType = {
    voucherCode: string
    discount: number
    quantity: number
    duration: Dayjs[]
    applyTicketId: string[]
    note: string | null
    project: string
}

function CreateVoucherComponent() {
    const { message } = App.useApp()
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>()
    const queryClient = useQueryClient()
    const step = Route.useSearch({ select: (data) => data.step ?? 0 })

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

    function nextStep() {
        navigate({
            search: {
                step: step + 1,
            },
        })
    }

    function prevStep() {
        navigate({
            search: {
                step: step - 1,
            },
        })
    }

    function setStep(step: number) {
        navigate({
            search: {
                step: step,
            },
        })
    }

    async function handleSubmit() {
        const values = form.getFieldsValue(true)
        return createVoucher.mutateAsync({
            ...values,
            startDate: values.duration[0],
            endDate: values.duration[1],
        })
    }

    return (
        <ContentWrapper
            headTitle='Create Voucher'
            title='Create Voucher'
            breadcrumbs={[{ breadcrumbName: 'Home', href: '/dashboard', title: 'Home' }]}
            innerStyle={{ marginBlock: '25px' }}
        >
            <ContentWrapper.ContentCard useCard>
                <Steps
                    current={step}
                    items={[
                        {
                            title: 'Select Project',
                        },
                        {
                            title: 'Select Tickets',
                        },
                        {
                            title: 'Voucher Information',
                        },
                    ]}
                />
                <ModalWrapper
                    modalComponent={({ setOpen }) => (
                        <CreateVoucherSuccess
                            setOpen={setOpen}
                            handleCreateFromScratch={() => {
                                form.resetFields()
                                setStep(0)
                            }}
                            handleCreateWithTickets={() => {
                                const res = createVoucher.data
                                if (!res) {
                                    setStep(0)
                                    message.error('Unable to resume. Returning to start')
                                    return
                                }
                                const project = res.data.project
                                const applyTicketId = res.data.applyTicketId
                                form.resetFields()
                                form.setFieldsValue({ project, applyTicketId })
                                setStep(3)
                            }}
                            handleCreateWithExisting={() => {
                                const res = createVoucher.data
                                if (!res) {
                                    setStep(0)
                                    message.error('Unable to resume. Returning to start')
                                    return
                                }
                                const project = res.data.project
                                form.resetFields()
                                form.setFieldsValue({ project })
                                setStep(1)
                            }}
                            createdId={createVoucher.data?.data.id}
                        />
                    )}
                    modalProps={{
                        footer: null,
                        centered: true,
                    }}
                >
                    {({ handleOpen }) => (
                        <Form
                            layout='vertical'
                            form={form}
                            className={'mt-10 px-0 xl:px-24'}
                            name='create-voucher-form'
                            onFinish={async () => {
                                const res = await handleSubmit()
                                if (res.data) {
                                    handleOpen()
                                }
                            }}
                            onValuesChange={(_, val) => {
                                devLog(val)
                            }}
                            key={step}
                        >
                            {step === 0 ? (
                                <Step1_SelectProject onFinish={nextStep} setStep={setStep} onPrev={prevStep} />
                            ) : step === 1 ? (
                                <Step2_SelectTickets onFinish={nextStep} setStep={setStep} onPrev={prevStep} />
                            ) : (
                                <Step3_VoucherInformation
                                    isSubmitting={createVoucher.isPending}
                                    onFinish={form.submit}
                                    setStep={setStep}
                                    onPrev={prevStep}
                                />
                            )}
                        </Form>
                    )}
                </ModalWrapper>
            </ContentWrapper.ContentCard>
        </ContentWrapper>
    )
}

type StepProps = {
    onFinish: () => void
    onPrev: () => void
    setStep: (step: number) => void
}

type Step1_FieldType = Pick<FieldType, 'project'>

function Step1_SelectProject({ onFinish }: StepProps) {
    const projects = useQuery({
        queryKey: projectQueryKeys.GetAll(),
        queryFn: Project_GetAll,
        select: (res) => res.data,
    })
    const form = Form.useFormInstance()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const limit = 9

    const filteredProjects = useMemo(() => {
        return projects.data?.filter((project) => project.projectName.includes(search))
    }, [projects.data, search])

    function handleSearch(value: string) {
        if (filteredProjects?.length !== 0) {
            setSearch(value)
            setPage(1)
        }
    }

    return (
        <section>
            <Card
                title={
                    <>
                        <span className='xs:inline hidden'>Select Project</span>
                        <Tooltip title='Your voucher will only be applicable to this project.' className='ml-2'>
                            <InfoCircleFilled />
                        </Tooltip>
                    </>
                }
                extra={
                    <Flex gap={16}>
                        {search && (
                            <Button type='link' onClick={() => handleSearch('')}>
                                Reset
                            </Button>
                        )}
                        <RefreshButton queryKey={projectQueryKeys.GetAll()} noText />
                        <Input.Search
                            className='xs:w-auto w-32'
                            placeholder='Search...'
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Flex>
                }
                styles={{
                    actions: {
                        height: '55px',
                    },
                }}
                actions={[
                    <Form.Item shouldUpdate>
                        {() => (
                            <Button type='primary' onClick={() => onFinish()} disabled={!form.getFieldValue('project')}>
                                Next
                            </Button>
                        )}
                    </Form.Item>,
                ]}
            >
                <Form.Item<Step1_FieldType> name='project' rules={[{ required: true, message: 'Please select a project' }]}>
                    <CheckCard.Group loading={projects.isLoading} className='w-full' bordered>
                        {projects.isSuccess && (
                            <>
                                <div className='xs:grid-cols-1 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3'>
                                    {filteredProjects?.slice((page - 1) * limit, page * limit).map((project, index) => (
                                        <CheckCard
                                            checked={false}
                                            avatar={<Avatar className='h-12 w-12' src={`https://picsum.photos/id/${index}/200`} />}
                                            key={`step-1_project_${project.id}`}
                                            title={
                                                <Typography.Title
                                                    level={5}
                                                    ellipsis
                                                    className='mb-0 leading-none'
                                                    title={project.projectName}
                                                >
                                                    {project.projectName}
                                                </Typography.Title>
                                            }
                                            value={project.id}
                                            description={project.description}
                                            className='mb-0 w-full'
                                            actions={[
                                                <Tooltip title={project.projectName}>Peek</Tooltip>,
                                                <Link to='/projects/$id' params={{ id: project.id }}>
                                                    <Button type='link'>View</Button>
                                                </Link>,
                                            ]}
                                        />
                                    ))}
                                </div>
                                {filteredProjects?.length === 0 && (
                                    <div className='w-full text-center'>
                                        <svg
                                            className='mx-auto h-12 w-12 text-gray-400'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                            aria-hidden='true'
                                        >
                                            <path
                                                vectorEffect='non-scaling-stroke'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
                                            />
                                        </svg>
                                        <h3 className='mt-2 text-sm font-semibold text-gray-900'>No projects</h3>
                                        <p className='mt-1 text-sm text-gray-500'>Get started by creating a new project.</p>
                                        <div className='mt-6'>
                                            <Link to='/projects/create'>
                                                <button
                                                    type='button'
                                                    className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                >
                                                    <PlusOutlined className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' />
                                                    New Project
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                {filteredProjects?.length !== 0 && (
                                    <Pagination
                                        responsive
                                        className='mt-5 flex w-full justify-end'
                                        total={filteredProjects?.length ?? 0}
                                        pageSize={limit}
                                        current={page}
                                        defaultCurrent={page}
                                        onChange={(page) => setPage(page)}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} projects`}
                                    />
                                )}
                            </>
                        )}
                    </CheckCard.Group>
                </Form.Item>
            </Card>
        </section>
    )
}

function Step2_SelectTickets({ onFinish, setStep, onPrev }: StepProps) {
    const form = Form.useFormInstance()
    const projectId = useMemo(() => form.getFieldValue('project'), [form])
    const tickets = useQuery({
        queryKey: ticketsQueryKeys.GetAllByProjectId(projectId),
        queryFn: () => Tickets_GetAllByProjectId({ projectId }),
        select: (data) => data.data,
    })
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const limit = 5

    const filteredTickets = useMemo(() => {
        return tickets.data?.filter((ticket) => ticket.ticketName.includes(search))
    }, [search, tickets.data])

    function handleSearch(value: string) {
        setSearch(value)
    }

    useEffect(() => {
        if (!projectId) {
            setStep(0)
        }
    }, [projectId, setStep])

    return (
        <section>
            <Card
                title={
                    <>
                        <span className='xs:inline hidden'>Select Ticket</span>
                        <Tooltip title='Your voucher will only be applicable to these tickets' className='ml-2'>
                            <InfoCircleFilled />
                        </Tooltip>
                    </>
                }
                extra={
                    <Flex gap={16}>
                        {search && (
                            <Button type='link' onClick={() => handleSearch('')}>
                                Reset
                            </Button>
                        )}
                        <RefreshButton queryKey={ticketsQueryKeys.GetAllByProjectId(projectId)} noText />
                        <Input.Search
                            placeholder='Search...'
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className='xs:w-auto w-32'
                        />
                    </Flex>
                }
                actions={[
                    <Button onClick={onPrev}>Back</Button>,
                    <Form.Item shouldUpdate noStyle>
                        {() => (
                            <Button type='primary' onClick={() => onFinish()} disabled={!form.getFieldValue('project')}>
                                Next
                            </Button>
                        )}
                    </Form.Item>,
                ]}
            >
                <Form.Item name='applyTicketId'>
                    <CheckCard.Group loading={tickets.isLoading} className='w-full' bordered multiple>
                        {tickets.isSuccess && (
                            <>
                                <div className='grid grid-cols-1 gap-3'>
                                    {filteredTickets?.map((ticket, index) => (
                                        <CheckCard
                                            style={{
                                                display: index >= (page - 1) * limit && index < page * limit ? 'block' : 'none',
                                            }}
                                            checked={false}
                                            avatar={<Avatar className='h-12 w-12' src={`https://picsum.photos/id/${index}/200`} />}
                                            key={`step-2_tickets_${ticket.id}`}
                                            title={ticket.ticketName}
                                            value={ticket.id}
                                            description={<Typography.Paragraph className='mb-0'>{ticket.description}</Typography.Paragraph>}
                                            className='mb-0 w-full'
                                        />
                                    ))}
                                </div>
                                <Pagination
                                    className='mt-5 flex w-full justify-end'
                                    total={filteredTickets?.length ?? 0}
                                    pageSize={limit}
                                    current={page}
                                    defaultCurrent={page}
                                    onChange={(page) => setPage(page)}
                                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} tickets`}
                                />
                            </>
                        )}
                    </CheckCard.Group>
                </Form.Item>
            </Card>
        </section>
    )
}

function Step3_VoucherInformation({ onFinish, setStep, isSubmitting }: StepProps & { isSubmitting: boolean }) {
    const form = Form.useFormInstance()
    const projectId = useMemo(() => form.getFieldValue('project'), [form])

    useEffect(() => {
        if (!projectId) {
            setStep(0)
        }
    }, [projectId, setStep])

    return (
        <section>
            <Card
                title='Voucher Information'
                actions={[
                    <Button key='back' onClick={() => setStep(1)}>
                        Back
                    </Button>,
                    <Button key='submit' type='primary' onClick={() => onFinish()} loading={isSubmitting}>
                        Submit
                    </Button>,
                ]}
            >
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
                                const vouchers = await TicketVoucher_GetAllByProjectId({ projectId })

                                if (vouchers.data.find((v) => v.voucherCode === value)) {
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
            </Card>
        </section>
    )
}
