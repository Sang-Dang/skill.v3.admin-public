import ProfileDropdown from '@/common/components/ProfileDropdown'
import Head from '@/common/util/Head'
import { useAuth } from '@/common/util/useAuth'
import { UserOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { Avatar, Breadcrumb, Button, CardProps, Flex, Grid, Layout, Space, Spin, theme, Typography } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { CSSProperties, ReactNode } from 'react'

const { Header, Content } = Layout

export type ContentWrapperProps = {
    children: ReactNode
    title: string
    breadcrumbs?: BreadcrumbItemType[]
    headTitle: string | undefined
    innerStyle?: CSSProperties
    footer?: boolean
}
export default function ContentWrapper({ children, title, breadcrumbs, headTitle = '', innerStyle }: ContentWrapperProps) {
    const { token } = theme.useToken()
    const tokenDetails = useAuth().getTokenPayload()
    const screens = Grid.useBreakpoint()

    return (
        <>
            <Head title={headTitle} />
            <Header
                style={{
                    paddingInline: screens.xs ? 'var(--page-padding-inline-mobile)' : 'var(--page-padding-inline)',
                    paddingLeft: screens.xs ? 'var(--page-padding-inline)' : '',
                    background: token.colorBgContainer,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '93px',
                }}
            >
                <Flex vertical gap={0} justify='space-between' align='flex-start'>
                    <Breadcrumb items={breadcrumbs} />
                    <Typography.Title
                        level={screens.xs ? 4 : 3}
                        style={{
                            lineHeight: 1.1,
                        }}
                    >
                        {title}
                    </Typography.Title>
                </Flex>
                <Space>
                    <ProfileDropdown>
                        <Button
                            type='text'
                            style={{
                                height: 'max-content',
                                display: 'flex',
                                gap: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Avatar shape='circle' icon={<UserOutlined />} size='large' />
                            {screens.md && (
                                <Typography.Paragraph
                                    style={{
                                        fontSize: token.fontSizeLG,
                                        color: token.colorTextLabel,
                                        display: 'block',
                                    }}
                                >
                                    {tokenDetails.username}
                                </Typography.Paragraph>
                            )}
                        </Button>
                    </ProfileDropdown>
                </Space>
            </Header>
            <Content
                style={{
                    paddingInline: screens.md ? 'var(--page-padding-inline)' : 'var(--page-padding-inline-mobile)',
                    ...innerStyle,
                }}
            >
                {children}
            </Content>
        </>
    )
}

export type ContentCardProps = { children: ReactNode } & (
    | { useCard: true; cardProps?: CardProps }
    | { useCard?: false; style?: CSSProperties }
)
ContentWrapper.ContentCard = ({ children, ...props }: ContentCardProps) => {
    const { token } = theme.useToken()

    if (props.useCard) {
        return (
            <ProCard key={'card'} {...props.cardProps}>
                {children}
            </ProCard>
        )
    } else {
        return (
            <div
                key={'not card'}
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: '100%',
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    ...props.style,
                }}
            >
                {children}
            </div>
        )
    }
}

ContentWrapper.LoadingCard = function LoadingCard() {
    return <Spin className='h-full w-full' />
}
