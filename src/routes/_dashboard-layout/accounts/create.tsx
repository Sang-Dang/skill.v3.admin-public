import { Accounts_Create } from '@/api/accounts/Accounts_Create'
import { Accounts_GetAll } from '@/api/accounts/Accounts_GetAll'
import { accountQueryKeys } from '@/api/accounts/key.query'
import ContentWrapper from '@/common/components/ContentWrapper'
import RoleTag from '@/common/components/RoleTag'
import { Role } from '@/lib/enum/role.enum'
import { useMutation } from '@tanstack/react-query'
import { Await, createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Form, Input, Select, Spin } from 'antd'

export const Route = createFileRoute('/_dashboard-layout/accounts/create')({
    component: CreateAccountComponent,
    loader: ({ context: { queryClient } }) => {
        const accounts = queryClient.ensureQueryData({
            queryKey: accountQueryKeys.GetAll(),
            queryFn: Accounts_GetAll,
        })

        return {
            accounts: defer(accounts),
        }
    },
    pendingComponent: () => <ContentWrapper.LoadingCard />,
})

type FieldType = {
    username: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    role: Role
}

function CreateAccountComponent() {
    const { message, notification } = App.useApp()
    const navigate = useNavigate()
    const account = Route.useLoaderData({ select: (res) => res.accounts })
    const [form] = Form.useForm<FieldType>()

    const roles = Object.values(Role).filter((role) => role !== Role.ADMIN)

    const createAccount = useMutation({
        mutationFn: Accounts_Create,
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Creating Account...',
                key: 'msg-create-account',
            })
        },
        onSettled: () => {
            message.destroy('msg-create-account')
        },
        onSuccess: (res) => {
            notification.success({
                message: 'Account Created Successfully!',
                description: (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/accounts/$id',
                                params: {
                                    id: res.data.id,
                                },
                            })
                        }
                    >
                        View Account
                    </Button>
                ),
            })
            form.resetFields()
        },
        onError: (error) => {
            devLog(error)
            message.error('Account Creation Failed, please try again.')
        },
    })

    function handleSubmit(values: FieldType) {
        createAccount.mutate(values)
    }

    return (
        <ContentWrapper
            headTitle='Create Account'
            title='Create Account'
            breadcrumbs={[{ breadcrumbName: 'Home', href: '/dashboard', title: 'Home' }]}
            innerStyle={{ marginBlock: '25px' }}
        >
            <Form form={form} name='create-account-form' layout='vertical' requiredMark={false} onFinish={handleSubmit}>
                <ContentWrapper.ContentCard
                    useCard
                    cardProps={{
                        title: 'Please fill in the form below to create an account',
                    }}
                >
                    <Await promise={account} fallback={<Spin />}>
                        {(accounts) => (
                            <>
                                <Form.Item<FieldType>
                                    name='email'
                                    label='Email'
                                    validateDebounce={500}
                                    tooltip="What is the user's email? (must be unique)"
                                    validateFirst
                                    hasFeedback
                                    rules={[
                                        {
                                            type: 'email',
                                            max: 255,
                                            required: true,
                                        },
                                        {
                                            validator(_, value, callback) {
                                                if (accounts.data.some((account) => account.email === value)) {
                                                    callback('Email already exists')
                                                } else {
                                                    callback()
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input size='large' />
                                </Form.Item>
                                <Flex justify='space-between' gap={24}>
                                    <Form.Item<FieldType>
                                        name='username'
                                        label='Username'
                                        className='w-full'
                                        validateDebounce={500}
                                        tooltip="What is the user's username? (must be unique)"
                                        validateFirst
                                        hasFeedback
                                        rules={[
                                            {
                                                max: 255,
                                                required: true,
                                            },
                                            {
                                                validator(_, value, callback) {
                                                    if (accounts.data.some((account) => account.username === value)) {
                                                        callback('Username already exists')
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
                                        name='phone'
                                        label='Phone Number'
                                        className='w-full'
                                        validateDebounce={500}
                                        tooltip="What is the user's phone number?"
                                        validateFirst
                                        hasFeedback
                                        rules={[
                                            {
                                                max: 12,
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input size='large' type='text' />
                                    </Form.Item>
                                </Flex>
                                <Form.Item<FieldType>
                                    name='password'
                                    label='Password'
                                    dependencies={['confirmPassword']}
                                    tooltip='Please enter a password'
                                    hasFeedback
                                    validateTrigger='onBlur'
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'string',
                                            min: 1,
                                            required: true,
                                            validator(_, value, callback) {
                                                if (value !== form.getFieldValue('confirmPassword')) {
                                                    callback('Passwords do not match')
                                                } else {
                                                    callback()
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input size='large' type='password' />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    name='confirmPassword'
                                    label='Confirm Password'
                                    dependencies={['password']}
                                    tooltip='Please retype your password'
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            validator(_, value, callback) {
                                                if (value !== form.getFieldValue('password')) {
                                                    callback('Passwords do not match')
                                                } else {
                                                    callback()
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input size='large' type='password' />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    name='role'
                                    label='Role'
                                    tooltip='What is the user role?'
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        size='large'
                                        options={roles.map((role) => ({
                                            label: <RoleTag role={role}></RoleTag>,
                                            value: role,
                                        }))}
                                        showSearch
                                        allowClear
                                    ></Select>
                                </Form.Item>
                                <Form.Item shouldUpdate className='mb-0 mt-3'>
                                    {() => (
                                        <Flex gap={12}>
                                            <Button type='primary' htmlType='submit' size='large' loading={createAccount.isPending}>
                                                Create Account
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
                </ContentWrapper.ContentCard>
            </Form>
        </ContentWrapper>
    )
}
