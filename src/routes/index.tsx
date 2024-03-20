import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, Divider, Form, Input, theme } from 'antd'

const { useToken } = theme

export const Route = createFileRoute('/')({
    component: IndexPage,
})

type LoginFormFieldType = {
    email: string
    password: string
}

function IndexPage() {
    const [form] = Form.useForm<LoginFormFieldType>()
    const { token } = useToken()

    return (
        <div
            style={{
                minHeight: '100%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: token.colorBgLayout,
            }}
        >
            <Card
                bordered
                style={{
                    width: '30%',
                    boxShadow: token.boxShadowTertiary,
                    padding: token.paddingLG,
                }}
            >
                {/* <div
                    style={{
                        marginBottom: '20px',
                    }}
                >
                    <Typography.Title level={3}>Admin Portal</Typography.Title>
                    <Typography.Paragraph>Log in to your Admin Account</Typography.Paragraph>
                </div> */}
                <Form form={form} name='login-form' layout='vertical' requiredMark={false}>
                    <Form.Item<LoginFormFieldType>
                        label={
                            <div
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                Email Address
                            </div>
                        }
                        name='email'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email address',
                            },
                            {
                                type: 'email',
                                message: 'Please input a valid email address',
                            },
                        ]}
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Input type='text' />
                    </Form.Item>
                    <Form.Item<LoginFormFieldType>
                        label={
                            <div
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                Password
                            </div>
                        }
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                        ]}
                    >
                        <Input type='password' />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type='primary'
                            style={{
                                width: '100%',
                            }}
                        >
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
                <Divider>Or sign in with</Divider>
                <Button>Google</Button>
            </Card>
        </div>
    )
}
