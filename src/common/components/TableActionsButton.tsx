import { CopyToClipboardMenuItem } from '@/common/components/CopyToClipboardMenuItem'
import { BaseModel } from '@/lib/model/base.model'
import { EyeFilled, MoreOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Dropdown, Grid, MenuProps } from 'antd'

type Props<T extends BaseModel> = {
    record: T
    viewLink?: string
    appendItems?: MenuProps['items']
    customViewId?: string
}

export default function TableActionsButton<T extends BaseModel>({ record, viewLink, appendItems, customViewId }: Props<T>) {
    const screens = Grid.useBreakpoint()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [CopyToClipboardMenuItem(record.id), ...(appendItems || [])]

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
                                      onClick: () => navigate({ to: viewLink, params: { id: customViewId || record.id } }),
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
                onClick={() => navigate({ to: viewLink, params: { id: customViewId || record.id } })}
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
