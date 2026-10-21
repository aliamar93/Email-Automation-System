import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface BtnProps {
    variant?: 'primary' | 'danger' | 'success' | 'ghost' | 'outline'
    icon?: LucideIcon
    children?: ReactNode
    onClick?: () => void
    className?: string
    size?: 'sm' | 'md'
    disabled?: boolean
}

// App ka standard button (5 rang, 2 size)
export function Btn({
    variant = 'outline',
    icon: Icon,
    children,
    onClick,
    className = '',
    size = 'md',
    disabled,
}: BtnProps) {
    const v = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-xs shadow-blue-600/25',
        danger: 'bg-red-500 text-white hover:bg-red-600 border-red-500',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
        outline: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs',
    }[variant]
    const s = size === 'sm' ? 'h-9 px-3 text-[13px]' : 'h-11 px-4 text-[14px]'
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={'inline-flex item-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ' +
            v + ' ' + s + ' ' + className}>
            {Icon && <Icon size={size === 'sm' ? 15 : 17} />}
            {children}
        </button>
    )
}