import { ReloadOutlined } from '@ant-design/icons'
import { QueryFilters, ResetOptions, useQueryClient } from '@tanstack/react-query'
import { Button, ButtonProps, Grid, Tooltip } from 'antd'
import { useState } from 'react'

type Props = {
    queryKey: string[]
    buttonProps?: ButtonProps
    filters?: Omit<QueryFilters, 'queryKey'>
    options?: ResetOptions
    hideTextOnMobile?: boolean
}

export default function RefreshButton({ queryKey, buttonProps, filters, options, hideTextOnMobile = true }: Props) {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const screens = Grid.useBreakpoint()

    async function reload() {
        setIsLoading(true)
        await queryClient.resetQueries(
            {
                queryKey,
                ...filters,
            },
            {
                ...options,
            },
        )
        setIsLoading(false)
    }

    return (
        <Tooltip title='Refresh Data'>
            <Button onClick={reload} icon={<ReloadOutlined />} loading={isLoading} {...buttonProps}>
                {hideTextOnMobile && screens.xs ? '' : 'Refresh'}
            </Button>
        </Tooltip>
    )
}
