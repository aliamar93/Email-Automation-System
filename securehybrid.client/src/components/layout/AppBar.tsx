import { useState } from 'react'
import {
    Bell,
    ChevronDown,
    CircleAlert,
    CircleCheck,
    KeyRound,
    LogOut,
    Menu,
    Search,
    ShieldCheck,
    User,
    Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { NotificationKind } from '../../types'
import { Dropdown } from '../UI/Dropdown'


interface AppBarProps {
    onMenu: () => void
}
type MenuRow = [string, LucideIcon, () => void]

// Content ke upar wali bar: search, notifications aur user menu
export function AppBar({ onMenu }: AppBarProps) {
    const navigate = useNavigate()
    const { store, markAllRead, readOne, search, setSearch, results, toast } = useAppStore()
    const notifications = store.notifications
    const [bell, setBell] = useState(false)
    const [user, setUser] = useState(false)
    const [sopen, setSopen] = useState(false)
    const unread = notifications.filter((n) => !n.read).length
    const kindTone: Record<NotificationKind, string> = {
        error: 'bg-red-50 text-red-600',
        warn: 'bg-amber-50 text-amber-700',
        ok: 'bg-emerald-50 text-emerald-700',
    }
    const kindIcon: Record<NotificationKind, LucideIcon> = {
        error: CircleAlert,
        warn: CircleAlert,
        ok: CircleCheck,
    }
    return (
        <header className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm sm:top-[72px]">
            <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:px-6">
                <button
                    type="button"
                    onClick={onMenu}
                    aria-label="Open menu"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="relative max-w-[380px] flex-1">
                    <label className="relative block">
                        <span className="sr-only">Search reports, templates, connections</span>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={17} />
                        </span>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setSopen(true)
                            }}
                            onFocus={() => setSopen(true)}
                            placeholder="Search reports, templates, connections..."
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                        />
                    </label>
                    <Dropdown
                        open={sopen && search.trim().length > 0}
                        onClose={() => setSopen(false)}
                        className="left-0 w-full max-h-[320px] overflow-y-auto"
                    >
                        {results.length === 0 ? (
                            <p className="px-4 py-5 text-center text-[13px] text-slate-500">
                                No matches for “{search}”.
                            </p>
                        ) : (
                            results.map((r) => (
                                <button
                                    key={r.kind + r.id}
                                    type="button"
                                    onClick={() => {
                                        r.open()
                                        setSopen(false)
                                        setSearch('')
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                                >
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                                        <r.icon size={16} />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-[13.5px] font-medium text-slate-800">
                                            {r.title}
                                        </span>
                                        <span className="block truncate text-[12px] text-slate-500">{r.meta}</span>
                                    </span>
                                </button>
                            ))
                        )}
                    </Dropdown>
                </div>
                <div className="ml-auto flex items-center gap-1 sm:gap-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setBell(!bell)
                                setUser(false)
                            }}
                            aria-label={'Notifications, ' + unread + ' unread'}
                            aria-expanded={bell}
                            className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Bell size={20} />
                            {unread > 0 && (
                                <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                    {unread}
                                </span>
                            )}
                        </button>
                        <Dropdown open={bell} onClose={() => setBell(false)} className="w-[340px] sm:w-[380px]">
                            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                                <p className="text-[14px] font-bold text-slate-900">Notifications</p>
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                    {unread} new
                                </span>
                                <button
                                    type="button"
                                    onClick={markAllRead}
                                    className="ml-auto text-[12.5px] font-medium text-blue-600 hover:underline"
                                >
                                    Mark all read
                                </button>
                            </div>
                            <ul className="max-h-[300px] overflow-y-auto">
                                {notifications.map((n) => {
                                    const K = kindIcon[n.kind]
                                    return (
                                        <li key={n.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    readOne(n.id)
                                                    setBell(false)
                                                    navigate('/executions')
                                                }}
                                                className={
                                                    'flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 ' +
                                                    (n.read ? '' : 'bg-blue-50/40')
                                                }
                                            >
                                                <span
                                                    className={
                                                        'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ' +
                                                        kindTone[n.kind]
                                                    }
                                                >
                                                    <K size={16} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[13.5px] font-semibold text-slate-800">
                                                        {n.title}
                                                    </span>
                                                    <span className="block text-[12.5px] leading-snug text-slate-500">
                                                        {n.text}
                                                    </span>
                                                    <span className="mt-1 block text-[11.5px] text-slate-400">
                                                        {n.time}
                                                    </span>
                                                </span>
                                                {!n.read && (
                                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                                )}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                            <button
                                type="button"
                                onClick={() => {
                                    setBell(false)
                                    navigate('/executions')
                                }}
                                className="block w-full border-t border-slate-100 px-4 py-3 text-center text-[13px] font-medium text-blue-600 hover:bg-slate-50"
                            >
                                View all activity
                            </button>
                        </Dropdown>
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setUser(!user)
                                setBell(false)
                            }}
                            aria-expanded={user}
                            aria-label="Account menu"
                            className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 hover:bg-slate-100"
                        >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-[13px] font-bold text-white">
                                JD
                            </span>
                            <span className="hidden text-left leading-tight sm:block">
                                <span className="block text-[14px] font-semibold text-slate-900">John Doe</span>
                                <span className="block text-[12px] text-slate-500">IT Operations</span>
                            </span>
                            <span className="hidden text-slate-400 sm:block">
                                <ChevronDown size={16} />
                            </span>
                        </button>
                        <Dropdown open={user} onClose={() => setUser(false)} className="w-[280px]">
                            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                                <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-[15px] font-bold text-white">
                                    JD
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-bold text-slate-900">John Doe</p>
                                    <p className="truncate text-[12.5px] text-slate-500">john.doe@company.com</p>
                                    <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                        Administrator
                                    </span>
                                </div>
                            </div>
                            <ul className="py-1.5">
                                {(
                                    [
                                        ['My profile', User, () => toast('Profile opened')],
                                        ['Notification preferences', Bell, () => navigate('/settings')],
                                        ['API keys & tokens', KeyRound, () => navigate('/settings')],
                                        ['Roles & permissions', Users, () => navigate('/settings')],
                                        ['Audit trail', ShieldCheck, () => navigate('/audit')],
                                    ] as MenuRow[]
                                ).map(([label, Ic, fn]) => (
                                    <li key={label}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUser(false)
                                                fn()
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] text-slate-700 hover:bg-slate-50"
                                        >
                                            <Ic size={17} />
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => {
                                    setUser(false)
                                    toast('Signed out')
                                }}
                                className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-[13.5px] font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={17} />
                                Sign out
                            </button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    )
}

