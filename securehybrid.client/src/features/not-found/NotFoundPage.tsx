import { Link } from 'react-router'
import { PageHeader } from '../../components/UI/PageHeader'

export function NotFoundPage() {
    return (
        <>
            <PageHeader title="Page not Found" subtitle="This address doesn't exist." />
            <Link to="/" className="text-[14px] font-semibold text-blue-600 hover:underline">
            Go to the Dashboard
            </Link>
        </>
    )
}