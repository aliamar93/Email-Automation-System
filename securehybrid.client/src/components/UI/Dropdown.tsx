import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface DropdownProps {
    open: boolean
    onClose: () => void
    children: ReactNode
    className?: string
}

// Button ke neeche khulne wala menu. Bahar click ya Escape se band.
export function Dropdown({ open, onClose, children, className = '' }: DropdownProps) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!open) return
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose()
        }
        const k = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('mousedown', h)
        document.addEventListener('keydown', k)
        return () => {
            document.removeEventListener('mousedown', h)
            document.removeEventListener('keydown', k)
        }
    }, [open, onClose])
    if (!open) return null
    return (
        <div ref={ref} className={'absolute right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-slate-200 bg-white shadow-xl ' + className
        }>
            {children}
        </div>
    )
}