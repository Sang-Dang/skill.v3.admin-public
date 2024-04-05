import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'

export const Route = createFileRoute('/test/')({
    component: Test,
})

function Test() {
    return (
        <div className='w-96'>
            <Scanner
                onResult={(text, result) => console.log(text, result)}
                onError={(error) => console.log(error?.message)}
                enabled
                options={{}}
            />
        </div>
    )
}
