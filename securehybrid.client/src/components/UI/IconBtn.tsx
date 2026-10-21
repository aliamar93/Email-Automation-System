import type { ReactNode } from 'react'

interface IconBtnProps {
    title: string
    tone?: string
    children: ReactNode
    onClick?: () => void
}

// Table rows ke chhote icon buttons (view, edit, delete...)

export function IconBtn({ title, tone = 'text-slate-500', children, onClick }: IconBtnProps) {
    return (
        <button type="button" title={title} aria-label={title} onClick={onClick} className={'grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 ' +
            tone}>
            {children}
        </button>
    )
}