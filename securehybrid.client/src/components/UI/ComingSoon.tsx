import { PageHeader } from './PageHeader'


interface ComingSoonProps {
    title: string
}

// Jin pages ko abhi banaya nahi, un ke liye ek hi component
export function ComingSoon({ title }: ComingSoonProps) {
    return (
        <>
            <PageHeader title={title} subtitle="This page will be built in a later step." />
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-[14px] text-slate-500">
                Coming soon
            </div>
        </>
    )
}