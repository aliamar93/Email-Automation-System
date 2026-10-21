import { Building2, Database, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import { NAV_ITEMS } from './navItems'

interface SidebarProps {
    open: boolean
    onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const { store } = useAppStore()

    // Menu ke saath chhote numbers: kitne reports, kitne failed runs
    const counts: Record<string, number | null> = {
        reports: store.reports.length,
        executions: store.executions.filter((e) => e.status === 'Failed').length || null,
    }

    return (
        <>
            {/* Mobile par sidebar ke peeche dark parda. Click karne se menu band. */}
            <div
                onClick={onClose}
                className={'fixed inset-0 z-40 bg-slate-900/50 lg:hidden ' + (open ? 'block' : 'hidden')}
                aria-hidden="true"
            />

            <aside
                aria-label="Main navigation"
                className={
                    'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-linear-to-b from-navy-900 to-navy-800 transition-transform duration-200 lg:top-[72px] lg:z-30 lg:translate-x-0 ' +
                    (open ? 'translate-x-0' : '-translate-x-full')
                }
            >
                {/* App ka naam + close button (sirf mobile par) */}
                <div className="flex items-start gap-3 border-b border-white/10 px-4 py-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
                        <Database size={18} />
                    </span>
                    <p className="text-[12.5px] font-semibold leading-tight text-white">
                        Scheduled SQL Report &amp; Email Automation System
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 lg:hidden"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Menu items. Child routes (/reports/12) par bhi parent active rehta hai. */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const badge = counts[item.key]

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] transition-colors ' +
                                    (isActive
                                        ? 'bg-blue-600 font-semibold text-white shadow-lg shadow-blue-900/30'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white')
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} />
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {badge ? (
                                            <span
                                                className={
                                                    'rounded-full px-2 py-0.5 text-[11px] font-semibold ' +
                                                    (isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300')
                                                }
                                            >
                                                {badge}
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Neeche company ka naam */}
                <div className="border-t border-white/10 px-4 py-4">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-slate-400">
                            <Building2 size={22} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[12.5px] font-semibold leading-tight text-slate-200">
                                Your Company Logistics &amp; Warehouse ERP
                            </p>
                            <p className="text-[11px] leading-tight text-slate-400">
                                Turning Data into Operational Excellence
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-500">v1.0.0 · offline build</p>
                </div>
            </aside>
        </>
    )
}
