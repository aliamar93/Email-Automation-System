import type { ReactNode } from 'react'
import { C } from '../../lib/styles'

interface FieldProps {
    label: ReactNode
    required?: boolean
    children: ReactNode
    className?: string
    hint?: ReactNode
}

// Form field: label + input + chhota hint
export function Field({ label, required, children, className = '', hint }: FieldProps) {
    return (
        <label className={'block ' + className}>
            <span className={C.label}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>
            {children}
            {hint && <span className="mt-1 block text-[11.5px] text-slate-500">{hint}</span>}
            {hint && <span className="mt-1 block text-[11.5px] text-slate-500">{hint}</span>}
        </label>

    )
}