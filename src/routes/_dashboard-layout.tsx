import { Role } from '@/lib/enum/role.enum'
import { cn } from '@/lib/utils/cn'
import {
    AccountBookOutlined,
    DashboardOutlined,
    FileAddOutlined,
    IdcardOutlined,
    LeftOutlined,
    ProjectOutlined,
    RightOutlined,
    SearchOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons'
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { Button, Grid, Layout, Menu, theme } from 'antd'
import { useState } from 'react'

const { Sider } = Layout

export const Route = createFileRoute('/_dashboard-layout')({
    component: DashboardLayout,
    beforeLoad: async ({ context: { authHandler }, location }) => {
        const response = await authHandler.authorize(Role.ADMIN)
        if (!response) {
            throw redirect({
                to: '/',
                search: {
                    error: "You don't have permission to access this page.",
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
})

function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const { token } = theme.useToken()
    const screens = Grid.useBreakpoint()

    return (
        <Layout
            hasSider
            style={{
                height: '100%',
            }}
        >
            {screens.xs && !collapsed && (
                <div
                    className='fixed left-0 top-0 z-[999] h-screen w-screen cursor-pointer bg-black/20'
                    onClick={() => setCollapsed((prev) => !prev)}
                ></div>
            )}
            <Sider
                breakpoint='lg'
                collapsedWidth={0}
                collapsed={collapsed}
                onCollapse={(collapsed) => setCollapsed(collapsed)}
                collapsible
                theme='light'
                trigger={null}
                width={screens.xs ? '225' : 256}
                className={screens.xs ? 'absolute left-0 top-0 z-[1000] h-full rounded-r-xl' : ''}
                style={{
                    borderRight: '1px solid',
                    borderColor: token.colorBorderSecondary,
                }}
            >
                <div
                    style={{
                        height: '93px',
                        display: 'grid',
                        placeItems: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: token.fontSizeHeading3,
                            fontWeight: 'bold',
                            backgroundColor: token.colorPrimaryBg,
                            color: token.colorTextBase,
                            width: '60%',
                            paddingBlock: '5px',
                            textAlign: 'center',
                            borderRadius: token.borderRadiusLG,
                        }}
                    >
                        Skira
                    </div>
                </div>
                <Menu
                    theme='light'
                    mode='inline'
                    items={[
                        {
                            key: '/dashboard',
                            label: 'Dashboard',
                            icon: <DashboardOutlined />,
                        },
                        {
                            key: 'accounts',
                            label: 'Accounts',
                            icon: <AccountBookOutlined />,
                            children: [
                                {
                                    label: 'Account List',
                                    key: '/accounts',
                                    icon: <UnorderedListOutlined />,
                                },
                                {
                                    label: 'Create Account',
                                    key: '/accounts/create',
                                    icon: <FileAddOutlined />,
                                },
                                {
                                    label: 'Search Accounts',
                                    key: '/accounts/search',
                                    icon: <SearchOutlined />,
                                },
                            ],
                        },
                        {
                            key: 'projects',
                            label: 'Projects',
                            icon: <ProjectOutlined />,
                            children: [
                                {
                                    label: 'Project List',
                                    key: '/projects',
                                    icon: <UnorderedListOutlined />,
                                },
                                {
                                    label: 'Create Project',
                                    key: '/projects/create',
                                    icon: <FileAddOutlined />,
                                },
                            ],
                        },
                        {
                            key: 'tickets',
                            label: 'Tickets',
                            icon: <IdcardOutlined />,
                            children: [
                                {
                                    label: 'Ticket List',
                                    key: '/tickets',
                                    icon: <UnorderedListOutlined />,
                                },
                                {
                                    label: 'Create Ticket',
                                    key: '/tickets/create',
                                    icon: <FileAddOutlined />,
                                },
                                {
                                    label: 'Ticket Orders',
                                    key: '/tickets/orders',
                                },
                                {
                                    label: 'Ticket Vouchers',
                                    key: '/tickets/vouchers',
                                },
                            ],
                        },
                    ]}
                    onClick={(info) =>
                        navigate({
                            to: info.key,
                        })
                    }
                />
                <Button
                    className={cn(
                        'absolute left-full top-6 z-[105]',
                        collapsed ? 'left-[calc(100%+21px)] rounded-lg' : 'rounded-l-none rounded-r-full border-l-0',
                    )}
                    size='large'
                    icon={collapsed ? <RightOutlined className='text-base' /> : <LeftOutlined className='text-base' />}
                    onClick={() => setCollapsed((prev) => !prev)}
                />
            </Sider>
            <Layout>
                <Outlet />
            </Layout>
        </Layout>
    )
}
