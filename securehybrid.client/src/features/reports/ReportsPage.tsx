
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
    CalendarClock,
    CircleAlert,
    CirclePause,
    Copy,
    Eye,
    FileText,
    Funnel,
    History,
    Pencil,
    Play,
    Plus,
    RefreshCw,
    Search,
    Send,
    Trash2,
} from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { DataTable } from '../../components/UI/DataTable'
import { Empty } from '../../components/UI/Empty'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { Pager } from '../../components/UI/Pager'
import { Pill } from '../../components/UI/Pill'
import { SqlEditor } from '../../components/UI/SqlEditor'
import { Toggle } from '../../components/UI/Toggle'
import { C } from '../../lib/styles'
import { useNavigate } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { Column } from '../../components/UI/DataTable'
import type { Report } from '../../types'

// Saare scheduled reports: filters, sort, bulk actions aur quick view
export function ReportsPage() {
    const { store, setStore, toast, runReport, confirm, audit } = useAppStore()
    const navigate = useNavigate()
    const { reports } = store
    const [f, setF] = useState({
        q: '',
        status: 'All',
        format: 'All',
        type: 'All',
        owner: 'All',
    })
    const [fOpen, setFOpen] = useState(false)
    const [sort, setSort] = useState<{ key: keyof Report; dir: 'asc' | 'desc' }>({ key: 'id', dir: 'asc' })
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(8)
    const [sel, setSel] = useState<number[]>([])
    const [view, setView] = useState<Report | null>(null)
    // Filter badlo aur pehle page par wapas jao
    const set = (k: keyof typeof f, v: string) => {
        setF((s) => ({
            ...s,
            [k]: v,
        }))
        setPage(1)
    }
    // Report on/off (disable karne par schedule ruk jata hai)
    const toggleActive = (r: Report) => {
        setStore((s) => ({
            ...s,
            reports: s.reports.map((x) =>
                x.id === r.id
                    ? {
                        ...x,
                        active: !x.active,
                        status: !x.active ? 'Pending' : 'Disabled',
                    }
                    : x,
            ),
        }))
        audit(
            r.active ? 'Disable' : 'Enable',
            'Report #' + r.id,
            (r.active ? 'Report disabled' : 'Report enabled') + ' from the report list',
        )
        toast(r.title + (r.active ? ' disabled' : ' enabled'))
    }
    const duplicate = (r: Report) => {
        const id = Math.max(...reports.map((x) => x.id)) + 1
        setStore((s) => ({
            ...s,
            reports: s.reports.concat([
                {
                    ...r,
                    id,
                    title: r.title + ' (copy)',
                    active: false,
                    status: 'Draft',
                },
            ]),
        }))
        audit('Create', 'Report #' + id, 'Duplicated from report #' + r.id)
        toast('Duplicated as report #' + id)
    }
    const remove = (r: Report) =>
        confirm({
            title: 'Delete “' + r.title + '”?',
            danger: true,
            confirmLabel: 'Delete report',
            body: 'The schedule and its configuration are removed immediately. Execution records stay for the 90-day retention period and the deletion is written to the audit log.',
            onConfirm: () => {
                setStore((s) => ({
                    ...s,
                    reports: s.reports.filter((x) => x.id !== r.id),
                }))
                audit('Delete', 'Report #' + r.id, 'Report deleted by John Doe')
                toast('Report deleted')
            },
        })
    const filtered = useMemo(() => {
        const q = f.q.trim().toLowerCase()
        const out = reports.filter(
            (r) =>
                (!q ||
                    r.title.toLowerCase().includes(q) ||
                    r.recipient.toLowerCase().includes(q) ||
                    String(r.id).includes(q)) &&
                (f.status === 'All' || r.status === f.status) &&
                (f.format === 'All' || r.formats.includes(f.format)) &&
                (f.type === 'All' || r.type === f.type) &&
                (f.owner === 'All' || r.owner === f.owner),
        )
        const dir = sort.dir === 'asc' ? 1 : -1
        // Sort ke liye value: list ho to jod do, true/false ko 1/0
        const val = (r: Report): string | number => {
            const v = r[sort.key]
            return Array.isArray(v) ? v.join() : typeof v === 'boolean' ? Number(v) : v
        }
        return [...out].sort((a, b) => (val(a) === val(b) ? 0 : (val(a) > val(b) ? 1 : -1) * dir))
    }, [reports, f, sort])
    const rows = filtered.slice((page - 1) * perPage, page * perPage)
    const allSel = rows.length > 0 && rows.every((r) => sel.includes(r.id))
    // Column header jo click par sort karta hai
    const sortBtn = (key: keyof Report, label: string) => (
        <button
            type="button"
            onClick={() =>
                setSort((s) => ({
                    key,
                    dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc',
                }))
            }
            className="inline-flex items-center gap-1.5 hover:text-slate-900"
        >
            {label}
            <span className={'text-[10px] ' + (sort.key === key ? 'text-blue-600' : 'text-slate-400')}>
                {sort.key === key ? (sort.dir === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
        </button>
    )
    const cols: Column<Report>[] = [
        {
            key: 'sel',
            label: '',
            width: 44,
            mobile: false,
            cell: (r) => (
                <input
                    type="checkbox"
                    aria-label={'Select ' + r.title}
                    checked={sel.includes(r.id)}
                    onChange={() => setSel((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : s.concat([r.id])))}
                    className="h-4 w-4 rounded-sm border-slate-300 accent-blue-600"
                />
            ),
        },
        {
            key: 'id',
            label: sortBtn('id', 'ID'),
            width: 70,
            cell: (r) => <span className="font-medium">{r.id}</span>,
        },
        {
            key: 'title',
            label: sortBtn('title', 'Report Title'),
            primary: true,
            cell: (r) => (
                <button
                    type="button"
                    onClick={() => navigate(`/reports/${r.id}`)}
                    className="text-left text-[14px] font-semibold text-slate-800 hover:text-blue-600"
                >
                    {r.title}
                </button>
            ),
        },
        {
            key: 'recipient',
            label: sortBtn('recipient', 'Recipients'),
            cell: (r) => (
                <span className="text-blue-600">
                    {r.to[0] || r.recipient}
                    {r.to.length > 1 ? ' +' + (r.to.length - 1) : ''}
                </span>
            ),
        },
        {
            key: 'type',
            label: sortBtn('type', 'Schedule'),
            cell: (r) => (
                <>
                    <div className="font-medium">{r.type}</div>
                    <div className="text-slate-500">{r.detail}</div>
                </>
            ),
        },
        {
            key: 'formats',
            label: 'Output Format',
            cell: (r) => r.formats.join(', '),
        },
        {
            key: 'last',
            label: sortBtn('last', 'Last Run'),
            cell: (r) => (
                <>
                    <div>{r.last[0]}</div>
                    <div className="text-slate-500">{r.last[1]}</div>
                </>
            ),
        },
        {
            key: 'next',
            label: sortBtn('next', 'Next Run'),
            cell: (r) => (
                <>
                    <div>{r.next[0]}</div>
                    <div className="text-slate-500">{r.next[1]}</div>
                </>
            ),
        },
        {
            key: 'status',
            label: sortBtn('status', 'Last Status'),
            cell: (r) => <Pill status={r.status} />,
        },
        {
            key: 'active',
            label: 'Active',
            cell: (r) => (
                <Toggle
                    on={r.active}
                    onChange={() => toggleActive(r)}
                    label={(r.active ? 'Disable ' : 'Enable ') + r.title}
                />
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            cell: (r) => (
                <div className="flex items-center gap-1.5">
                    <IconBtn title="View" tone="text-blue-600" onClick={() => setView(r)}>
                        <Eye size={16} />
                    </IconBtn>
                    <IconBtn title="Edit" tone="text-blue-600" onClick={() => navigate(`/reports/${r.id}/edit`)}>
                        <Pencil size={16} />
                    </IconBtn>
                    <IconBtn title="Run now" tone="text-emerald-600" onClick={() => runReport(r)}>
                        <Play size={15} />
                    </IconBtn>
                    <IconBtn title="Duplicate" onClick={() => duplicate(r)}>
                        <Copy size={16} />
                    </IconBtn>
                    <IconBtn title="Execution history" onClick={() => navigate(`/reports/${r.id}`)}>
                        <History size={16} />
                    </IconBtn>
                    <IconBtn title="Delete" tone="text-red-500" onClick={() => remove(r)}>
                        <Trash2 size={16} />
                    </IconBtn>
                </div>
            ),
        },
    ]
    return (
        <>
            <PageHeader
                title="Scheduled Reports"
                sub="Manage and monitor your scheduled SQL reports and email automation."
                actions={
                    <>
                        <Btn variant="primary" icon={Plus} onClick={() => navigate('/reports/new')}>
                            Create Report
                        </Btn>
                        <Btn icon={RefreshCw} onClick={() => toast('Report list refreshed')}>
                            Refresh
                        </Btn>
                    </>
                }
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
                {[
                    {
                        v: reports.length,
                        l: 'Total Reports',
                        i: FileText,
                        t: 'bg-blue-50 text-blue-600',
                        c: 'text-blue-600',
                    },
                    {
                        v: reports.filter((r) => r.active).length,
                        l: 'Active Reports',
                        i: Play,
                        t: 'bg-emerald-50 text-emerald-600',
                        c: 'text-emerald-600',
                    },
                    {
                        v: reports.filter((r) => !r.active).length,
                        l: 'Disabled Reports',
                        i: CirclePause,
                        t: 'bg-slate-100 text-slate-500',
                        c: 'text-slate-600',
                    },
                    {
                        v: reports.filter((r) => r.status === 'Failed').length,
                        l: 'Failed Reports',
                        i: CircleAlert,
                        t: 'bg-red-50 text-red-500',
                        c: 'text-red-600',
                    },
                    {
                        v: 12,
                        l: 'Reports Sent Today',
                        i: Send,
                        t: 'bg-sky-50 text-sky-600',
                        c: 'text-sky-600',
                    },
                ].map((k) => (
                    <div key={k.l} className={C.card + ' flex items-center gap-3 p-4'}>
                        <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-xl ' + k.t}>
                            <k.i size={21} />
                        </span>
                        <div className="min-w-0">
                            <p className={'text-[26px] font-bold leading-none ' + k.c}>{k.v}</p>
                            <p className="mt-1 truncate text-[13px] text-slate-500">{k.l}</p>
                        </div>
                    </div>
                ))}
                <div className={C.card + ' col-span-2 flex items-center gap-3 p-4 sm:col-span-3 xl:col-span-1'}>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                        <CalendarClock size={21} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[16px] font-bold leading-tight text-slate-900">Mon, Apr 28</p>
                        <p className="text-[16px] font-bold leading-tight text-slate-900">08:00 AM</p>
                        <p className="mt-1 truncate text-[13px] text-slate-500">Next Scheduled Run</p>
                    </div>
                </div>
            </div>
            <div className={C.card + ' p-4'}>
                <div className="flex items-center gap-3 lg:hidden">
                    <label className="relative flex-1">
                        <span className="sr-only">Search reports</span>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={17} />
                        </span>
                        <input
                            type="search"
                            value={f.q}
                            onChange={(e) => set('q', e.target.value)}
                            placeholder="Search reports..."
                            className={C.input + ' pl-10'}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => setFOpen(!fOpen)}
                        aria-expanded={fOpen}
                        className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[14px] font-medium text-slate-700"
                    >
                        <Funnel size={17} />
                        Filters
                    </button>
                </div>
                <div
                    className={
                        (fOpen ? 'grid' : 'hidden') +
                        ' mt-4 grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-3 xl:grid-cols-6 xl:gap-4'
                    }
                >
                    <label className="hidden lg:block">
                        <span className={C.label + ' text-transparent'}>.</span>
                        <span className="relative block">
                            <span className="sr-only">Search reports</span>
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={17} />
                            </span>
                            <input
                                type="search"
                                value={f.q}
                                onChange={(e) => set('q', e.target.value)}
                                placeholder="Search reports..."
                                className={C.input + ' pl-10'}
                            />
                        </span>
                    </label>
                    <Field label="Status">
                        <select className={C.input} value={f.status} onChange={(e) => set('status', e.target.value)}>
                            {['All', 'Success', 'Running', 'Failed', 'Pending', 'Disabled', 'Draft'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Output Format">
                        <select className={C.input} value={f.format} onChange={(e) => set('format', e.target.value)}>
                            {['All', 'Excel', 'PDF'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Schedule Type">
                        <select className={C.input} value={f.type} onChange={(e) => set('type', e.target.value)}>
                            {['All', 'Hourly', 'Daily', 'Weekly', 'Monthly'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Created By">
                        <select className={C.input} value={f.owner} onChange={(e) => set('owner', e.target.value)}>
                            {['All', 'John Doe', 'A. Fischer', 'System'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Date Range">
                        <input type="date" className={C.input} />
                    </Field>
                </div>
            </div>
            {sel.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <p className="text-[13.5px] font-semibold text-blue-800">{sel.length} selected</p>
                    <div className="ml-auto flex flex-wrap gap-2">
                        <Btn
                            size="sm"
                            icon={Play}
                            onClick={() => {
                                toast(sel.length + ' runs queued')
                                setSel([])
                            }}
                        >
                            Run selected
                        </Btn>
                        <Btn
                            size="sm"
                            icon={CirclePause}
                            onClick={() => {
                                setStore((s) => ({
                                    ...s,
                                    reports: s.reports.map((r) =>
                                        sel.includes(r.id)
                                            ? {
                                                ...r,
                                                active: false,
                                                status: 'Disabled',
                                            }
                                            : r,
                                    ),
                                }))
                                audit('Disable', sel.length + ' reports', 'Bulk disable from the report list')
                                toast(sel.length + ' reports disabled')
                                setSel([])
                            }}
                        >
                            Disable
                        </Btn>
                        <Btn
                            size="sm"
                            variant="danger"
                            icon={Trash2}
                            onClick={() =>
                                confirm({
                                    title: 'Delete ' + sel.length + ' reports?',
                                    danger: true,
                                    confirmLabel: 'Delete all',
                                    body: 'Each schedule is removed immediately. Execution history is kept for the retention period.',
                                    onConfirm: () => {
                                        setStore((s) => ({
                                            ...s,
                                            reports: s.reports.filter((r) => !sel.includes(r.id)),
                                        }))
                                        audit('Delete', sel.length + ' reports', 'Bulk delete')
                                        toast('Reports deleted')
                                        setSel([])
                                    },
                                })
                            }
                        >
                            Delete
                        </Btn>
                    </div>
                </div>
            )}
            <section className={C.card + ' overflow-hidden'}>
                <div className="hidden items-center gap-3 border-b border-slate-100 px-4 py-2.5 lg:flex">
                    <input
                        type="checkbox"
                        aria-label="Select all reports"
                        checked={allSel}
                        onChange={() => setSel(allSel ? [] : rows.map((r) => r.id))}
                        className="h-4 w-4 rounded-sm border-slate-300 accent-blue-600"
                    />
                    <span className="text-[12.5px] text-slate-500">Select all on this page</span>
                </div>
                <DataTable
                    cols={cols}
                    rows={rows}
                    minWidth={1240}
                    empty={
                        <Empty
                            icon={Search}
                            title="No reports match these filters"
                            text="Clear a filter or create a new scheduled report."
                            action={
                                <Btn variant="primary" icon={Plus} onClick={() => navigate('/reports/new')}>
                                    Create Report
                                </Btn>
                            }
                        />
                    }
                />
                <Pager
                    page={page}
                    setPage={setPage}
                    total={filtered.length}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
            </section>
            <Modal
                open={!!view}
                size="md"
                title={view ? view.title : ''}
                sub={view ? 'Report #' + view.id + ' · quick view' : ''}
                onClose={() => setView(null)}
                footer={
                    view && (
                        <>
                            <Btn onClick={() => setView(null)}>Close</Btn>
                            <Btn
                                icon={Pencil}
                                onClick={() => {
                                    const v = view
                                    setView(null)
                                    navigate(`/reports/${v.id}/edit`)
                                }}
                            >
                                Edit
                            </Btn>
                            <Btn
                                variant="primary"
                                icon={Eye}
                                onClick={() => {
                                    const v = view
                                    setView(null)
                                    navigate(`/reports/${v.id}`)
                                }}
                            >
                                Open details
                            </Btn>
                        </>
                    )
                }
            >
                {view && (
                    <div className="space-y-4">
                        <p className="text-[13.5px] text-slate-600">{view.description}</p>
                        <dl className="grid grid-cols-2 gap-4">
                            {(
                                [
                                    ['Status', <Pill status={view.status} />],
                                    ['Active', view.active ? 'Yes' : 'No'],
                                    ['Schedule', view.type + ' · ' + view.detail],
                                    ['Database', view.db],
                                    ['Output', view.formats.join(', ')],
                                    ['Owner', view.owner],
                                    ['Last run', view.last.join(' ')],
                                    ['Next run', view.next.join(' ')],
                                ] as [string, ReactNode][]
                            ).map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-[12px] text-slate-500">{k}</dt>
                                    <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <div>
                            <p className="mb-1.5 text-[12px] text-slate-500">Recipients</p>
                            <div className="flex flex-wrap gap-2">
                                {view.to.map((e) => (
                                    <span key={e} className={C.chip + ' bg-blue-50 text-blue-700'}>
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="mb-1.5 text-[12px] text-slate-500">SQL query</p>
                            <SqlEditor value={view.sql} onChange={() => { }} readOnly={true} rows={8} />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}


// import { PageHeader } from '../../components/UI/PageHeader'



// export function ReportsPage() {
//     return (
//         <>
//             <PageHeader title="Scheduled Reports" subtitle="Create, schedule and monitor the SQL reports that are emailed automatically." />

//             <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-500">The reports table comes here (next step).</div>
//         </>
//     )
// }