import { Scanner } from '@yudiel/react-qr-scanner'
import { Modal } from 'antd'
import { ReactNode, useState } from 'react'

type Props = {
    children: ({ handleOpen }: { handleOpen: () => void }) => ReactNode
}

export default function CheckInModal({ children }: Props) {
    const [open, setOpen] = useState(false)
    const [dataStore, setDataStore] = useState<any[]>([])

    function handleOpen() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal open={open} onCancel={handleClose} title='Check In Scanner'>
                <Scanner
                    onResult={(text) => {
                        setDataStore((prev) => [...prev, text])
                    }}
                    onError={(error) => console.log(error)}
                />
                <div className='mt-4'>{dataStore.join(', ')}</div>
            </Modal>
        </>
    )
}
