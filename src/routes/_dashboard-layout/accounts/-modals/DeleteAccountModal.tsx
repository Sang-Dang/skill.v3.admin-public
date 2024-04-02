import { Accounts_Delete } from '@/api/accounts/Accounts_Delete'
import { accountQueryKeys } from '@/api/accounts/key.query'
import { useAuth } from '@/common/util/useAuth'
import { UnauthorizedError } from '@/lib/errors/UnauthorizedError'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App, Button, Modal } from 'antd'
import { ReactNode, useState } from 'react'

type DeleteAccountModalProps = {
    children: ({ handleOpen }: { handleOpen: (accountId: string) => void }) => ReactNode
}

export default function DeleteAccountModal({ children }: DeleteAccountModalProps) {
    const [open, setOpen] = useState(false)
    const [accountId, setAccountId] = useState<string | undefined>()
    const authHandler = useAuth()
    const { message } = App.useApp()
    const queryCLient = useQueryClient()

    const deleteAccount = useMutation({
        mutationFn: () => {
            const token = authHandler.getToken()

            if (!token) {
                throw new UnauthorizedError()
            }

            return Accounts_Delete({ id: accountId!, token })
        },
        onMutate: () => {
            message.open({
                type: 'loading',
                content: 'Deleting Account...',
                key: 'msg-delete-account',
            })
        },
        onError: (error, variables) => {
            devLog(error, variables)
            message.error('Account Deletion Failed, please try again.')
        },
        onSuccess: () => {
            message.success('Account Deleted Successfully.')
            queryCLient.invalidateQueries({
                queryKey: accountQueryKeys.GetAll,
            })
        },
        onSettled: () => {
            message.destroy('msg-delete-account')
        },
    })

    function handleOpen(accountId: string) {
        setOpen(true)
        setAccountId(accountId)
    }

    function handleClose() {
        setOpen(false)
        setAccountId(undefined)
    }

    return (
        <>
            {children({ handleOpen })}
            <Modal
                open={open}
                onCancel={handleClose}
                centered
                footer={[
                    <Button key='cancel' onClick={handleClose}>
                        Cancel
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        danger
                        onClick={() => {
                            deleteAccount.mutate()
                            handleClose()
                        }}
                    >
                        Delete
                    </Button>,
                ]}
            >
                Are you sure you want to delete this account?
            </Modal>
        </>
    )
}
