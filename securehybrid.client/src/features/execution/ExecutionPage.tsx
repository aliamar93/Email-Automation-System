import { PageHeader } from '../../components/UI/PageHeader'

export function ExecutionPage() {
    return (
        <>
            <PageHeader title="Execution History" subtitle="Every scheduled, manual and retried run, with its log and generated files." />

            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-500">The Execution History comes here (next step).</div>
        </>
    )
}