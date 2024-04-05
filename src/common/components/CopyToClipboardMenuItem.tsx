import { handleCopy } from '@/common/util/handleCopy'
import { IdcardOutlined } from '@ant-design/icons'

export const CopyToClipboardMenuItem = (id: string) => {
    return {
        label: 'Copy ID',
        key: 'table-actions-copyId',
        onClick: () => handleCopy(id),
        icon: <IdcardOutlined />,
    }
}
