import type { ReactNode } from 'react'
import { C } from '../../lib/styles'


interface CardProps {
    title?: ReactNode
    sub?: ReactNode
    right?: ReactNode
    children?: ReactNode
    pad?: boolean
    className?: string
}

// Safed card: upar title/actions, neeche content
export function Card({ title, sub, right, children, pad = true, className = '' }: CardProps) {
    return (
        <section className={C.card + ' ' + className}>
            {(title || right) && (
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                    <div className="min-w-0">
                        {title && <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>}
                        {sub && <p className="mt-0.5 text-[12.5px] text-slate-500">{sub}</p>}
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2">{right}</div>
                </div>
            )}
            <div className={pad ? 'p-4 sm:p-5' : ''}>{children}</div>
        </section>
    )
}