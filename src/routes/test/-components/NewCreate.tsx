import { projectQueryKeys } from '@/api/projects/key.query'
import { Project_GetAll } from '@/api/projects/Project_GetAll'
import ContentWrapper from '@/common/components/ContentWrapper'
import { DefaultLocale } from '@/common/util/DefaultLocale'
import {
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormInstance,
    ProFormMoney,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    StepsForm,
} from '@ant-design/pro-components'
import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { Button, Grid } from 'antd'
import { Dayjs } from 'dayjs'
import { useRef } from 'react'

export const Route = createFileRoute('/_dashboard-layout/tickets/create')({
    component: CreateTicketComponent,
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
    ticketName: string
    description: string
    price: number
    quantity: number
    duration: Dayjs[]
    project: string
}

function CreateTicketComponent() {
    const formRef = useRef<ProFormInstance>()
    const projects = Route.useLoaderData({ select: (res) => res.projects })
    const screens = Grid.useBreakpoint()

    return (
        <ContentWrapper
            headTitle='Create Ticket'
            title='Create Ticket'
            breadcrumbs={[{ breadcrumbName: 'Home', href: '/dashboard', title: 'Home' }]}
            innerStyle={{ marginBlock: '25px' }}
        >
            <ContentWrapper.ContentCard useCard>
                <StepsForm<FieldType>
                    formRef={formRef}
                    onFinish={async () => {
                        console.log('Test')
                    }}
                    formProps={{
                        validateMessages: {
                            required: 'This field is required.',
                        },
                    }}
                    submitter={{
                        render: (props) => (
                            <>
                                <Button type='default' onClick={props.onPre} disabled={props.step === 0}>
                                    Back
                                </Button>
                                <Button type='primary' onClick={props.onSubmit}>
                                    {props.step === 4 ? 'Submit' : 'Next'}
                                </Button>
                            </>
                        ),
                        resetButtonProps: {},
                        submitButtonProps: {},
                    }}
                >
                    <StepsForm.StepForm<Pick<FieldType, 'project'>>
                        name='Project'
                        title='Project'
                        stepProps={{
                            description: 'Select a project',
                        }}
                        style={{
                            width: '100%',
                        }}
                        onFinish={async () => {
                            return true
                        }}
                    >
                        <Await promise={projects} fallback={<ContentWrapper.LoadingCard />}>
                            {(projects) => (
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
                                    showSearch
                                    width={screens.xs ? 'sm' : 'lg'}
                                    fieldProps={{
                                        size: 'large',
                                    }}
                                />
                            )}
                        </Await>
                    </StepsForm.StepForm>
                    <StepsForm.StepForm<Pick<FieldType, 'ticketName' | 'description' | 'price' | 'duration' | 'quantity'>>
                        name='Basic Ticket Details'
                        title='Basic Ticket Details'
                        stepProps={{
                            description: 'Standard information about the ticket',
                        }}
                        onFinish={async () => {
                            return true
                        }}
                    >
                        <ProFormText
                            name='ticketName'
                            label='Ticket Name'
                            placeholder=''
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    max: 255,
                                    min: 3,
                                    message: 'Ticket Name must be between 3-255 characters',
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                            }}
                        />
                        <ProFormTextArea
                            name='description'
                            label='Description'
                            className='w-full'
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    max: 2550,
                                    min: 3,
                                    message: 'Description must be between 3-2550 characters',
                                },
                            ]}
                            fieldProps={{
                                size: 'large',
                            }}
                            placeholder=''
                        />
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
                                lang: 'en',
                                locale: DefaultLocale,
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
                                    message: 'Price must be larger than 0',
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
                                    message: 'Quantity must be larger than 0',
                                },
                            ]}
                        />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        name='Ticket Design'
                        title='Ticket Design'
                        stepProps={{
                            description: 'Design your ticket',
                        }}
                    ></StepsForm.StepForm>
                </StepsForm>
            </ContentWrapper.ContentCard>
        </ContentWrapper>
    )
}
