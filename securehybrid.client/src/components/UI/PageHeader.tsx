import type { ReactNode } from 'react'
import { C } from '../../lib/styles'



interface PageHeaderProps {
    title: ReactNode
    sub?: ReactNode // "?" = ye prop optional hai
    actions?: ReactNode
    crumb?: ReactNode
}



// Har page ke upar: title, subtitle aur right side ke buttons
export function PageHeader({ title, sub, actions, crumb }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
                {crumb}
                <h1 className={C.h1}>{title}</h1>
                <p className={C.sub}>{sub}</p>
            </div>
            {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
        </div>
    )
}