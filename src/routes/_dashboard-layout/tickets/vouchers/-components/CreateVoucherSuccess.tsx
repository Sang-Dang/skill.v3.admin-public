import { CheckCircleOutlined, CreditCardOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Dropdown } from 'antd'

type Props = {
    setOpen: (open: boolean) => void
    createdId?: string
    handleCreateWithExisting: () => void
    handleCreateWithTickets: () => void
    handleCreateFromScratch: () => void
}

export default function CreateVoucherSuccess({
    setOpen,
    createdId,
    handleCreateFromScratch,
    handleCreateWithTickets,
    handleCreateWithExisting,
}: Props) {
    const navigate = useNavigate()
    return (
        <div className='relative transform overflow-hidden'>
            <div>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                    <CheckCircleOutlined className='text-3xl text-green-600' aria-hidden='true' />
                </div>
                <div className='mt-3 text-center sm:mt-5'>
                    <h3 className='text-xl font-semibold leading-6 text-gray-900'>Voucher Successfully Created</h3>
                    <div className='mt-2'>
                        <p className='text-sm text-gray-500'>
                            Your voucher has been successfully created. Users will now be able to apply those vouchers during the checkout
                            process.
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-5 grid grid-flow-row-dense grid-cols-2 gap-3'>
                <Button size='large' type='primary' onClick={() => navigate({ to: '/tickets/vouchers/$id', params: { id: createdId! } })}>
                    View
                </Button>
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'success-dropdown-item-1',
                                label: 'With existing project',
                                icon: <RetweetOutlined />,
                                onClick: () => {
                                    setOpen(false)
                                    handleCreateWithExisting()
                                },
                            },
                            {
                                key: 'success-dropdown-item-2',
                                label: 'With existing tickets',
                                icon: <CreditCardOutlined />,
                                onClick: () => {
                                    setOpen(false)
                                    handleCreateWithTickets()
                                },
                            },
                            {
                                key: 'success-dropdown-item-3',
                                label: 'From scratch',
                                icon: <SendOutlined />,
                                onClick: () => {
                                    setOpen(false)
                                    handleCreateFromScratch()
                                },
                            },
                        ],
                    }}
                >
                    <Button size='large'>Make another</Button>
                </Dropdown>
            </div>
        </div>
    )
}
