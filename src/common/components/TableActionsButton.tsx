import { BaseModel } from '@/lib/model/base.model'
import { EyeFilled, IdcardOutlined, MoreOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Dropdown, Grid, MenuProps } from 'antd'

type Props<T extends BaseModel> = {
    record: T
    viewLink?: string
    appendItems?: MenuProps['items']
}

export default function TableActionsButton<T extends BaseModel>({ record, viewLink, appendItems }: Props<T>) {
    const { message } = App.useApp()
    const screens = Grid.useBreakpoint()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            label: 'Copy ID',
            key: 'table-actions-copyId',
            onClick: () => {
                navigator.clipboard.writeText(record.id)
                message.success('ID copied to clipboard')
            },
            icon: <IdcardOutlined />,
        },
        ...(appendItems || []),
    ]

    if (!viewLink || screens.xs) {
        return (
            <Dropdown
                menu={{
                    items: [
                        ...(viewLink
                            ? [
                                  {
                                      label: 'View',
                                      key: 'table-actions-viewBtn',
                                      icon: <EyeFilled />,
                                      onClick: () => navigate({ to: viewLink, params: { id: record.id } }),
                                  },
                              ]
                            : []),
                        ...items,
                    ],
                }}
            >
                <Button icon={<MoreOutlined />} />
            </Dropdown>
        )
    } else {
        return (
            <Dropdown.Button
                size='middle'
                menu={{ items }}
                onClick={() => navigate({ to: viewLink, params: { id: record.id } })}
                style={{
                    padding: 0,
                }}
                overlayStyle={{
                    padding: 0,
                }}
            >
                {!screens.xs ? 'View' : ''}
            </Dropdown.Button>
        )
    }
}
