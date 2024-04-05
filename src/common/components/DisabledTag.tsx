import { Tag, TagProps, Tooltip } from 'antd'
import { Dayjs } from 'dayjs'
import { ReactNode } from 'react'

type Props = {
    disabledAt: Dayjs | null | undefined
    children?: ReactNode
    tagProps?: TagProps
    showEnabled?: boolean
}

export default function DisabledTag({ disabledAt, children, tagProps, showEnabled = true }: Props) {
    return disabledAt ? (
        <Tooltip title={`Disabled on ${disabledAt.format('MMMM DD, YYYY')}`}>
            {children || (
                <Tag color='red' {...tagProps}>
                    Disabled
                </Tag>
            )}
        </Tooltip>
    ) : (
        showEnabled && (
            <Tag color='green' {...tagProps}>
                Enabled
            </Tag>
        )
    )
}
