import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    title: string
    sub?: ReactNode
    onClose: () => void
    children?: ReactNode
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Popup dialog. Escape ya bahar click karne se band.
export function Modal({ open, title, sub, onClose, children, footer, size = 'lg' }: ModalProps) {
    useEffect(() => {
        if (!open) return
        const h = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', h)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', h)
            document.body.style.overflow = ''
        }
    }, [open, onClose])
    if (!open) return null
    const w = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    }[size]
    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-slate-900/60 p-0 sm:items-center sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}>
            <div role="dialog" aria-modal="true" aria-label={title} className={'my-0 w-full rounded-t-2xl bg-white shadow-2xl sm:my-8 sm:rounded-2xl ' + w}>
                <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
                    <div className="min-w-0">
                        <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
                        {sub && <p className="mt-0.5 text-[13px] text-slate-500">{sub}</p>}
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close dialog"
                        className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
                        <X size={17} />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
                {footer &&
                    (<div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-200 px-5 py-4">
                        {footer}
                    </div>
                    )}
            </div>
        </div>
    )
}