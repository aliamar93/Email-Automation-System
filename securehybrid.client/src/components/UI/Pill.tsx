import { TONE } from '../../lib/styles'

interface PillProps {
    status: string
    min?: number
}

// Status ka rangeen label (Success, Failed, Running...)
export function Pill({ status, min = 84 }: PillProps) {
    return (
        <span style={{ minWidth: min }}
            className={'inline-flex justify-center rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold ' +
                (TONE[status] || 'bg-slate-100 text-slate-500')
            }>
            {status}
        </span>
    )
}