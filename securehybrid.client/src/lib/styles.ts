// Baar baar use hone wali Tailwind classes ek jagah
export const C = {
    card: 'rounded-xl border border-slate-200 bg-white shadow-xs',
    input: 'w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-[14px] text-slate-700 shadow-xs focus:border-blue-500 focus:outline-hidden',
    label: 'mb-1.5 block text-[13px] font-medium text-slate-600',
    th: 'whitespace-nowrap px-4 py-3 text-left text-[12.5px] font-semibold text-slate-600',
    td: 'px-4 py-3 text-[13px] text-slate-700',
    h1: 'text-[26px] font-bold leading-tight text-slate-900 sm:text-[30px]',
    sub: 'mt-1 text-[14px] text-slate-500',
    chip: 'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium',
}

export const TONE: Record<string, string> = {
    Success: 'bg-emerald-50 text-emerald-700',
    Running: 'bg-blue-50 text-blue-700',
    Failed: 'bg-red-50 text-red-600',
    Pending: 'bg-amber-50 text-amber-700',
    Disabled: 'bg-slate-100 text-slate-500',
    'Partially Completed': 'bg-amber-50 text-amber-700',
    Sent: 'bg-emerald-50 text-emerald-700',
    Connected: 'bg-emerald-50 text-emerald-700',
    Draft: 'bg-slate-100 text-slate-500',
    Active: 'bg-emerald-50 text-emerald-700',
    Error: 'bg-red-50 text-red-600',
    Queued: 'bg-sky-50 text-sky-700',
}
