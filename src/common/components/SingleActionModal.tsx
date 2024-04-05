import { Button, Modal, ModalProps, Typography } from 'antd'
import { ReactNode, useState } from 'react'

export type SingleActionModalChildrenProps = {
    ho: () => void
}

export type SingleActionModal = {
    children: ({ ho }: SingleActionModalChildrenProps) => ReactNode
    onOk: () => void
    title?: ReactNode
    content?: ReactNode
    afterClose?: () => void
    modalProps?: ModalProps
    cancelButton?: ReactNode
    confirmButton?: ReactNode
}

export default function SingleActionModal({
    children,
    onOk,
    title = 'Please confirm action',
    content = (
        <div>
            <Typography.Text>
                You are about to commit a serious action. By clicking <strong>yes</strong>, you will
            </Typography.Text>
            <ul>
                <li>Do something</li>
                <li>Do something else</li>
                <li>Do something else</li>
            </ul>
        </div>
    ),
    afterClose,
    modalProps,
    cancelButton,
    confirmButton,
}: SingleActionModal) {
    const [open, setOpen] = useState(false)

    function handleOpen() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
        afterClose?.()
    }

    function handleOk() {
        onOk()
        handleClose()
    }

    return (
        <>
            {children({ ho: handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                onOk={handleOk}
                title={title}
                footer={[
                    cancelButton || (
                        <Button key='cancel' onClick={handleClose}>
                            Cancel
                        </Button>
                    ),
                    confirmButton || (
                        <Button key='ok' type='primary' danger onClick={handleOk}>
                            Confirm
                        </Button>
                    ),
                ]}
                {...modalProps}
            >
                {content}
            </Modal>
        </>
    )
}
