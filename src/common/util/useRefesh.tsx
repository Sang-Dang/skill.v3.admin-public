import { useEffect, useState } from 'react'

export default function useRefresh() {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        devLog('Refeshed using useRefresh')
    }, [open])

    function refresh() {
        setOpen((prev) => !prev)
    }

    return refresh
}
