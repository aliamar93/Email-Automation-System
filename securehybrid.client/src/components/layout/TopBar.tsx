import { Database } from 'lucide-react'
import { CONNECTOR_STRIP } from '../../mocks/reference'

// Sabse upar wali bar: logo, app ka naam, supported databases
export function TopBar() {
    return (
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-4 px-4 sm:h-[72px] sm:px-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-600/25">
                    <Database size={21} />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold leading-tight text-slate-900 sm:text-[17px]">
                        Scheduled SQL Report &amp; Email Automation System
                    </p>
                    <p className="hidden truncate text-[12.5px] text-slate-500 sm:block">
                        Automate Your Data. Deliver Insights. Keep Your Business Moving.
                    </p>
                </div>
                <ul className="mx-auto hidden items-center gap-4 rounded-xl border border-slate-200 px-4 py-1.5 2xl:flex">
                    {CONNECTOR_STRIP.map(({ name, icon: Icon, tone }) => (
                        <li key={name} className="flex w-[52px] flex-col items-center gap-1 text-center">
                            <span className={'grid h-7 w-7 place-items-center rounded-lg ' + tone}>
                                <Icon size={15} />
                            </span>
                            <span className="text-[9.5px] font-medium leading-tight text-slate-500">{name}</span>
                        </li>
                    ))}
                </ul>
                <div className="ml-auto hidden text-right lg:block 2xl:ml-0">
                    <p className="text-[12.5px] font-semibold text-blue-600">
                        Secure · Scalable · Reliable · Enterprise Ready
                    </p>
                    <p className="text-[11.5px] text-slate-500">Reports Today. A Smarter Tomorrow.</p>
                </div>
            </div>
        </div>
    )
}