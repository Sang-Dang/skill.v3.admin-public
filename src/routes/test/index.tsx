import { ProFormMoney } from '@ant-design/pro-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test/')({
    component: Test,
})

function Test() {
    return <ProFormMoney />
}
