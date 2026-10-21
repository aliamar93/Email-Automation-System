import type { ReactNode } from 'react'

interface CheckProps {
    children: ReactNode
    checked?: boolean
    onChange?: () => void
    disabled?: boolean
}

export function Check({ children, checked, onChange, disabled }: CheckProps) {
    return (
        <label className={'flex items-start gap-2.5 text-[13.5] ' + (disabled ? 'text-slate-400' : 'cursor-pointer text-slate-700')} >
            <input type="checkbox" checked={!!checked} disabled={disabled}
                onChange={onChange || (() => { })} className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-slate-300 accent-blue-600" />
            <span>{children}</span>
        </label>
    )
}