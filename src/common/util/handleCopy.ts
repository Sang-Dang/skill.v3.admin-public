import { message } from 'antd'

export function handleCopy(id: string) {
    navigator.clipboard.writeText(id)
    message.success('ID copied to clipboard')
}
