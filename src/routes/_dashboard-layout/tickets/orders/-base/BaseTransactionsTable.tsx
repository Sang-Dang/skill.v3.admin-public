import BaseTable, { BaseTablePropsCommon } from '@/common/components/BaseTable'
import { TransactionModel } from '@/lib/model/transaction.model'

export default function BaseTransactionsTable(props: BaseTablePropsCommon<TransactionModel>) {
    return (
        <BaseTable
            columns={[
                {
                    key: 'transactions-amount',
                    title: 'Amount',
                    dataIndex: 'amount',
                    width: 120,
                    ellipsis: true,
                    render: (value: number) => `${value.toLocaleString()} VND`,
                },
                {
                    key: 'transactions-reference',
                    title: 'Reference',
                    dataIndex: 'reference',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-transactionDateTime',
                    title: 'Transaction Date Time',
                    dataIndex: 'transactionDateTime',
                    width: 120,
                    ellipsis: true,
                    render: (value) => value.format('DD/MM/YYYY HH:mm:ss'),
                },
                {
                    key: 'transactions-description',
                    title: 'Description',
                    dataIndex: 'description',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-accountNumber',
                    title: 'Account Number',
                    dataIndex: 'accountNumber',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-counterAccountName',
                    title: 'Counter Account Name',
                    dataIndex: 'counterAccountName',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-virtualAccountName',
                    title: 'Virtual Account Name',
                    dataIndex: 'virtualAccountName',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-counterAccountBankId',
                    title: 'Counter Account Bank Id',
                    dataIndex: 'counterAccountBankId',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-counterAccountNumber',
                    title: 'Counter Account Number',
                    dataIndex: 'counterAccountNumber',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-virtualAccountNumber',
                    title: 'Virtual Account Number',
                    dataIndex: 'virtualAccountNumber',
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: 'transactions-counterAccountBankName',
                    title: 'Counter Account Bank Name',
                    dataIndex: 'counterAccountBankName',
                    width: 120,
                    ellipsis: true,
                },
                // BaseTable.ColumnActions({
                //     appendActions: props.appendActions,
                //     viewLink: '/tickets/orders/:id',
                //     customViewId: (record) => record.ticket.id,
                // }),
            ]}
            {...props}
        />
    )
}
