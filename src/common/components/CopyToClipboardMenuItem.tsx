import { IdcardOutlined } from '@ant-design/icons'
import { App } from 'antd'

export const CopyToClipboardMenuItem = (id: string) => {
    const { message } = App.useApp()

    function handleCopy() {
        navigator.clipboard.writeText(id)
        message.success('ID copied to clipboard')
    }

    return {
        label: 'Copy ID',
        key: 'table-actions-copyId',
        onClick: handleCopy,
        icon: <IdcardOutlined />,
    }
}
