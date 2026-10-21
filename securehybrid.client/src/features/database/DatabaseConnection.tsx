import { PageHeader } from '../../components/UI/PageHeader'


export function DatabaseConnection() {
    return (
        <>
            <PageHeader title="Database Connections" subtitle="Credentials are stored server-side and never shown in the interface." />

            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-500">Credentials are stored server-side.</div>
        </>
    )
}