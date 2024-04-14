import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, InputRef, Space, TableColumnType, Tooltip } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'

export default function TableColumnTextSearch<T>() {
    const [searchText, setSearchText] = useState<string>('')
    const [searchColumn, setSearchedColumn] = useState<keyof T>()
    const searchInput = useRef<InputRef>(null)

    function handleSearch(selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: keyof T) {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    function handleReset(clearFilters: () => void, confirm: FilterDropdownProps['confirm']) {
        setSearchText('')
        clearFilters()
        confirm()
    }

    const func = (dataIndex: keyof T, edit?: TableColumnType<T>): TableColumnType<T> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${String(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        size='small'
                        style={{
                            width: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 5,
                        }}
                    >
                        <SearchOutlined />
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size='small'
                        style={{ width: 50, flexGrow: 1 }}
                    >
                        Reset
                    </Button>
                    {/* <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            confirm({ closeDropdown: false })
                            setSearchText((selectedKeys as string[])[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button> */}
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close()
                        }}
                    >
                        <CloseOutlined />
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <Tooltip title='Search'>
                <SearchOutlined size={16} style={{ color: filtered ? '#1677ff' : undefined }} />
            </Tooltip>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()) ?? false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100)
            }
        },
        render: (text) =>
            searchColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
        ...edit,
    })

    return func
}
