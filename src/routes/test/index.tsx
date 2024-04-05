import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useState } from 'react'

export const Route = createFileRoute('/test/')({
    component: Test,
})

function Test() {
    const [data, setData] = useState<string | undefined>()

    return (
        <div>
            <div className='w-96'>
                <Scanner
                    onResult={(text) => {
                        setData(text)
                    }}
                    onError={(error) => console.log(error?.message)}
                    enabled
                    options={{}}
                />
            </div>
            <div className='mt-4'>{data}</div>
        </div>
    )
}
