import { Auth_Login } from '@/api/auth/Auth_Login'
import { Auth_LoginFirebase } from '@/api/auth/Auth_LoginFirebase'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Card, Divider, Form, Grid, Input, Tooltip } from 'antd'
import { UserCredential } from 'firebase/auth'
import { useEffect } from 'react'

import { createLazyFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/common/util/useAuth'

export const Route = createLazyFileRoute('/')({
    component: IndexPage,
})

type LoginFormField = {
    email: string
    password: string
}

function IndexPage() {
    const navigate = useNavigate()
    const auth = useAuth()
    const { message } = App.useApp()
    const screens = Grid.useBreakpoint()
    const error = Route.useSearch({
        select: (data) => data.error,
    })
    const redirect = Route.useSearch({
        select: (data) => data.redirect,
    })

    useEffect(() => {
        devLog(error)
        error && message.error(error)
    }, [message, error])

    const googleLogin = useMutation({
        mutationFn: async (firebaseResponse: UserCredential) => {
            const firebase = await firebaseResponse.user.getIdToken()
            return Auth_LoginFirebase({ firebase })
        },
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Logging in...',
                key: 'msg-login',
            })
        },
        onError: (error, variables) => {
            devLog(error, variables)
            message.error('Login failed! Please try again.')
        },
        onSettled: () => {
            message.destroy('msg-login')
        },
    })

    const credentialsLogin = useMutation({
        mutationFn: async (credentials: LoginFormField) => {
            return Auth_Login(credentials)
        },
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Logging in...',
                key: 'msg-login',
            })
        },
        onError: (error, variables) => {
            devLog(error, variables)
            message.error('Login failed! Please try again.')
        },
        onSettled: () => {
            message.destroy('msg-login')
        },
    })

    async function handleGoogleLogin(): Promise<void> {
        const firebaseReponse = await auth.showGoogleLogin()
        googleLogin.mutate(firebaseReponse, {
            onSuccess: async (res) => {
                auth.login(res.data)
                navigate({
                    to: redirect,
                })
            },
        })
    }

    async function handleCredentialsLogin(credentials: LoginFormField): Promise<void> {
        credentialsLogin.mutate(credentials, {
            onSuccess: async (res) => {
                auth.login(res.data)
                navigate({
                    to: '/dashboard',
                })
            },
        })
    }

    return (
        <>
            <div className='flex h-screen flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                    <img
                        className='mx-auto h-24 w-auto object-fill'
                        src='./logo.svg'
                        alt='Skillcetera Logo'
                        style={{
                            transform: screens.xs ? '' : 'scale(2)',
                            display: screens.xs ? 'none' : 'block',
                        }}
                    />
                    <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Sign in to your account</h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
                    <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
                        <Tooltip title='Credentials login has been disabled. Please login with Google.'>
                            <Card className='cursor-not-allowed opacity-80'>
                                <Form
                                    className='space-y-6'
                                    layout='vertical'
                                    requiredMark={false}
                                    onFinish={handleCredentialsLogin}
                                    disabled={true}
                                >
                                    <Form.Item<LoginFormField>
                                        name='email'
                                        label={
                                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                                Email address
                                            </label>
                                        }
                                        validateDebounce={500}
                                        validateFirst
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your email!',
                                            },
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                        ]}
                                    >
                                        <Input type='text' autoComplete='username' />
                                    </Form.Item>

                                    <Form.Item<LoginFormField>
                                        name='password'
                                        label={
                                            <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                                                Password
                                            </label>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                    >
                                        <Input type='password' autoComplete='current-password' />
                                    </Form.Item>

                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <input
                                                id='remember-me'
                                                name='remember-me'
                                                type='checkbox'
                                                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                                            />
                                            <label htmlFor='remember-me' className='ml-3 block text-sm leading-6 text-gray-900'>
                                                Remember me
                                            </label>
                                        </div>

                                        <div className='text-sm leading-6'>
                                            <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <Button
                                            type='primary'
                                            size='large'
                                            htmlType='submit'
                                            className='flex w-full justify-center text-sm font-semibold leading-6 text-white shadow-sm'
                                            loading={credentialsLogin.isPending || googleLogin.isPending}
                                        >
                                            Sign in
                                        </Button>
                                    </div>
                                </Form>
                            </Card>
                        </Tooltip>

                        <div>
                            <Divider className='mt-6' plain>
                                Or continue with
                            </Divider>

                            <div className='mt-2 grid gap-4'>
                                <Button
                                    size='large'
                                    className='flex w-full items-center justify-center gap-3 text-sm font-semibold text-gray-900'
                                    onClick={handleGoogleLogin}
                                >
                                    <svg className='h-5 w-5' aria-hidden='true' viewBox='0 0 24 24'>
                                        <path
                                            d='M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z'
                                            fill='#EA4335'
                                        />
                                        <path
                                            d='M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z'
                                            fill='#4285F4'
                                        />
                                        <path
                                            d='M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z'
                                            fill='#FBBC05'
                                        />
                                        <path
                                            d='M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z'
                                            fill='#34A853'
                                        />
                                    </svg>
                                    <span className='text-sm font-semibold leading-6'>Google</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <p className='mt-5 text-center text-sm text-gray-500'>
                        Lost?{' '}
                        <a href='#' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                            Return to Homepage
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
