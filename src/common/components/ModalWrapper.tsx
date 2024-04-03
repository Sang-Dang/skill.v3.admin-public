import { Modal, ModalProps } from 'antd'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

type ModalWrapperProps = {
    children: ({ handleOpen }: { handleOpen: () => void }) => ReactNode
    afterOpen?: () => void
    afterClose?: () => void
    modalProps?: ModalProps
    defaultOpen?: boolean
    modalComponent?: ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => ReactNode
}

export default function ModalWrapper({ children, afterOpen, modalComponent, afterClose, modalProps, defaultOpen }: ModalWrapperProps) {
    const [open, setOpen] = useState(defaultOpen || false)

    function handleOpen() {
        setOpen(true)
        if (afterOpen) {
            afterOpen()
        }
    }

    function handleClose() {
        setOpen(false)
        if (afterClose) {
            afterClose()
        }
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal open={open} onCancel={handleClose} onOk={handleClose} {...modalProps}>
                {modalComponent && modalComponent({ setOpen })}
            </Modal>
        </>
    )
}
