import { Helmet } from 'react-helmet'

type HeadProps = {
    title: string
}

export default function Head({ title }: HeadProps) {
    return (
        <Helmet>
            <title>{title} | Skira Admin</title>
        </Helmet>
    )
}
