import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyProps {
    icon?: LucideIcon
    title?: ReactNode
    text?: ReactNode
    action?: ReactNode
}

// Jab list khaali ho to ye dikhta hai

export function Empty({ icon: Icon = Inbox, title, text, action }: EmptyProps) {
    return (
        <div className="px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                <Icon size={24 }/>
            </span>
            <p className="mt-4 text-[15px] font-semibold text-slate-700">{title}</p>
            {text && <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-slate-500">{text}</p>}
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    )
}