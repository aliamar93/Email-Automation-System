import { useState } from 'react'
import type { ReactNode } from 'react'
import {
    CalendarClock,
    CircleAlert,
    CircleCheck,
    Copy,
    Database,
    Link,
    List,
    ListIndentIncrease,
    ListOrdered,
    Mail,
    Play,
    Table,
    X,
} from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { Check } from '../../components/UI/Check'
import { Field } from '../../components/UI/Field'
import { PageHeader } from '../../components/UI/PageHeader'
import { SqlEditor } from '../../components/UI/SqlEditor'
import { Toggle } from '../../components/UI/Toggle'
import { WRITE_STATEMENTS } from '../../lib/sql'
import { C } from '../../lib/styles'
import { FAILURE_REASONS, PREVIEW_COLS, PREVIEW_ROWS, VARIABLES, WEEK } from '../../mocks/reference'
import { DEFAULT_SQL, mkReport } from '../../mocks/reports'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { Report, ReportTemplate } from '../../types'

interface ChipsProps {
    label: string
    required?: boolean
    list: string[]
    onAdd: (email: string) => void
    onRemove: (email: string) => void
}

// To / CC / BCC: email likho, Enter dabao, chip ban jati hai
function Chips({ label, required, list, onAdd, onRemove }: ChipsProps) {
    const [v, setV] = useState('')
    return (
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
            <span className="w-12 shrink-0 pt-3 text-[13px] font-medium text-slate-600">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>
            <div className="flex min-h-[44px] flex-1 flex-wrap items-center gap-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                {list.map((e) => (
                    <span
                        key={e}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-[12.5px] text-blue-700"
                    >
                        {e}
                        <button
                            type="button"
                            aria-label={'Remove ' + e}
                            onClick={() => onRemove(e)}
                            className="text-blue-400 hover:text-blue-700"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="email"
                    value={v}
                    onChange={(e) => setV(e.target.value)}
                    placeholder="Add email and press Enter"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && v.trim()) {
                            e.preventDefault()
                            onAdd(v.trim())
                            setV('')
                        }
                    }}
                    className="h-7 min-w-[150px] flex-1 border-none text-[13px] outline-hidden placeholder:text-slate-400"
                />
            </div>
        </div>
    )
}

interface StepProps {
    n: number
    title: string
    right?: ReactNode
    children: ReactNode
}

// Form ka ek numbered section
function Step({ n, title, right, children }: StepProps) {
    return (
        <section className={C.card}>
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-[13px] font-bold text-white">
                    {n}
                </span>
                <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
                <div className="ml-auto flex flex-wrap items-center gap-2">{right}</div>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
        </section>
    )
}

interface ReportFormProps {
    report?: Report
    prefill?: ReportTemplate
}

// /reports/new, /reports/new?template=3 aur /reports/:id/edit teeno yahin aate hain
export function ReportFormPage() {
    const { id } = useParams()
    const [params] = useSearchParams()
    const { store } = useAppStore()
    const report = id ? store.reports.find((r) => r.id === Number(id)) : undefined
    const tplId = params.get('template')
    const prefill = tplId ? store.reportTemplates.find((t) => t.id === Number(tplId)) : undefined
    // key badalne par form naye sire se shuru hota hai
    return <ReportForm key={(id || 'new') + '-' + (tplId || '')} report={report} prefill={prefill} />
}

// Report banane / badalne ka form (7 steps)
function ReportForm({ report, prefill }: ReportFormProps) {
    const { store, setStore, toast, audit, runReport } = useAppStore()
    const navigate = useNavigate()
    const editing = !!report
    const [d, setD] = useState<Report>(() =>
        report
            ? { ...report }
            : mkReport({
                id: 0,
                title: prefill ? prefill.name : '',
                description: prefill ? prefill.description : '',
                recipient: '',
                sql: prefill ? prefill.sql : DEFAULT_SQL,
                formats: prefill ? prefill.formats : ['Excel', 'PDF'],
                to: [],
                cc: [],
                bcc: [],
                type: 'Daily',
                detail: '08:00 AM',
                last: ['—', '—'],
                next: ['Apr 28, 2025', '08:00 AM'],
                status: 'Draft',
                active: false,
            }),
    )
    const [valid, setValid] = useState<{ ok: boolean; msg: string } | null>(null)
    const [preview, setPreview] = useState(true)
    const [range, setRange] = useState('Today')
    // Form ki ek field badlo
    const u = <K extends keyof Report>(k: K, v: Report[K]) =>
        setD((s) => ({
            ...s,
            [k]: v,
        }))
    const toggleFormat = (f: string) =>
        u('formats', d.formats.includes(f) ? d.formats.filter((x) => x !== f) : d.formats.concat([f]))
    const toggleDay = (day: string) =>
        u('days', d.days.includes(day) ? d.days.filter((x) => x !== day) : d.days.concat([day]))
    const validate = () => {
        if (WRITE_STATEMENTS.test(d.sql)) {
            setValid({
                ok: false,
                msg: 'Write statement detected. Scheduled reports run with a read-only user — remove INSERT, UPDATE, DELETE, DROP, TRUNCATE, ALTER or EXEC.',
            })
            toast('Query blocked — write statement detected')
        } else if (!/select/i.test(d.sql)) {
            setValid({
                ok: false,
                msg: 'No SELECT statement found in the query.',
            })
            toast('Query is not a SELECT')
        } else {
            const cols = (d.sql.split(/from/i)[0].match(/,/g) || []).length + 1
            setValid({
                ok: true,
                msg: 'Query validated successfully. ' + cols + ' columns returned.',
            })
            toast('Query valid')
        }
    }
    // Save draft (activate = false) ya Save & Activate
    const save = (activate: boolean) => {
        if (!d.title.trim()) {
            toast('Report title is required')
            return
        }
        const now = 'Apr 27, 2025 02:15 PM'
        if (editing) {
            setStore((s) => ({
                ...s,
                reports: s.reports.map((r) =>
                    r.id === d.id
                        ? {
                            ...d,
                            active: activate ? true : d.active,
                            status: activate ? 'Pending' : d.status,
                            modifiedBy: 'John Doe',
                            modifiedAt: now,
                            recipient: d.to[0] || d.recipient,
                        }
                        : r,
                ),
            }))
            audit('Update', 'Report #' + d.id, activate ? 'Report updated and activated' : 'Report saved as draft')
            toast(activate ? 'Report updated and activated' : 'Draft saved')
            navigate(`/reports/${d.id}`)
        } else {
            const id = Math.max(100, ...store.reports.map((r) => r.id)) + 1
            const rec: Report = {
                ...d,
                id,
                active: !!activate,
                status: activate ? 'Pending' : 'Draft',
                recipient: d.to[0] || '',
                createdBy: 'John Doe',
                createdAt: now,
                modifiedBy: 'John Doe',
                modifiedAt: now,
            }
            setStore((s) => ({
                ...s,
                reports: s.reports.concat([rec]),
            }))
            audit('Create', 'Report #' + id, activate ? 'Report created and activated' : 'Report created as draft')
            toast(activate ? 'Report created and activated' : 'Draft saved')
            navigate(activate ? `/reports/${id}` : '/reports')
        }
    }
    return (
        <>
            <PageHeader
                title={editing ? 'Edit Scheduled Report' : 'Create Scheduled Report'}
                sub="Configure your SQL query, output format, recipients and schedule."
                crumb={
                    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[13px]">
                        <button
                            type="button"
                            onClick={() => navigate('/reports')}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Scheduled Reports
                        </button>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-500">{editing ? 'Edit #' + d.id : 'Create Report'}</span>
                    </nav>
                }
            />
            <Step n={1} title="General Information">
                <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr_auto] lg:items-start lg:gap-6">
                    <Field label="Report Title" required={true}>
                        <input
                            type="text"
                            value={d.title}
                            onChange={(e) => u('title', e.target.value)}
                            placeholder="Warehouse Orders Report"
                            className={C.input}
                        />
                    </Field>
                    <Field label="Description">
                        <input
                            type="text"
                            value={d.description}
                            onChange={(e) => u('description', e.target.value)}
                            placeholder="What this report contains"
                            className={C.input}
                        />
                    </Field>
                    <div>
                        <span className={C.label}>Active</span>
                        <div className="flex h-11 items-center gap-2.5">
                            <Toggle on={d.active} onChange={() => u('active', !d.active)} label="Report active" />
                            <span className="text-[13.5px] font-medium text-slate-700">
                                {d.active ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </div>
            </Step>
            <Step
                n={2}
                title={'Data Source & Query'}
                right={
                    <span
                        className={
                            'text-[12px] font-semibold ' +
                            (valid ? (valid.ok ? 'text-emerald-600' : 'text-red-600') : 'text-slate-400')
                        }
                    >
                        {valid ? (valid.ok ? 'Validated' : 'Blocked') : 'Not validated yet'}
                    </span>
                }
            >
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.6fr_1.4fr] lg:gap-5">
                    <Field label="Database Connection" required={true}>
                        <select className={C.input} value={d.db} onChange={(e) => u('db', e.target.value)}>
                            {store.connections.map((c) => (
                                <option key={c.id}>{c.name + ' (' + c.engine + ')'}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Query Timeout (seconds)">
                        <input
                            type="number"
                            value={d.timeout}
                            onChange={(e) => u('timeout', Number(e.target.value))}
                            className={C.input}
                        />
                    </Field>
                    {valid ? (
                        <div
                            className={
                                'flex items-start gap-3 self-end rounded-lg border p-3 ' +
                                (valid.ok ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50')
                            }
                        >
                            <span className="mt-0.5 shrink-0">
                                {valid.ok ? (
                                    <CircleCheck size={19} />
                                ) : (
                                    <span className="text-red-500">
                                        <CircleAlert size={19} />
                                    </span>
                                )}
                            </span>
                            <div>
                                <p
                                    className={
                                        'text-[14px] font-bold ' + (valid.ok ? 'text-emerald-800' : 'text-red-700')
                                    }
                                >
                                    {valid.ok ? 'Query Valid' : 'Query Blocked'}
                                </p>
                                <p className={'text-[12.5px] ' + (valid.ok ? 'text-emerald-700' : 'text-red-700')}>
                                    {valid.msg}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 self-end rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <span className="mt-0.5 shrink-0 text-slate-400">
                                <CircleAlert size={19} />
                            </span>
                            <div>
                                <p className="text-[14px] font-bold text-slate-700">Not validated</p>
                                <p className="text-[12.5px] text-slate-500">
                                    Run Validate Query before activating the schedule.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)_auto]">
                    <div>
                        <span className={C.label}>
                            SQL Query <span className="text-red-500">*</span>{' '}
                            <span className="font-normal text-slate-400">— editable, parameters as @Name</span>
                        </span>
                        <SqlEditor
                            value={d.sql}
                            onChange={(v) => {
                                u('sql', v)
                                setValid(null)
                            }}
                            rows={15}
                        />
                    </div>
                    <div className="flex flex-row gap-3 xl:w-[170px] xl:flex-col xl:self-center">
                        <Btn icon={Database} onClick={validate} className="flex-1">
                            Validate Query
                        </Btn>
                        <Btn
                            variant="primary"
                            icon={Play}
                            onClick={() => {
                                setPreview(true)
                                toast('Preview refreshed — 2,430 rows')
                            }}
                            className="flex-1"
                        >
                            Preview Results
                        </Btn>
                        <Btn
                            icon={Copy}
                            onClick={() => {
                                u('sql', DEFAULT_SQL)
                                setValid(null)
                                toast('Query reset to template')
                            }}
                            className="hidden xl:flex"
                        >
                            Reset query
                        </Btn>
                    </div>
                    <div>
                        <p className={C.label}>Preview Results (5 rows)</p>
                        {preview ? (
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full min-w-[640px] border-collapse">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            {PREVIEW_COLS.map((h) => (
                                                <th
                                                    key={h}
                                                    className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PREVIEW_ROWS.map((row) => (
                                            <tr key={row[0]} className="border-b border-slate-100 last:border-0">
                                                {row.map((cell, i) => (
                                                    <td
                                                        key={i}
                                                        className={
                                                            'whitespace-nowrap px-3 py-2.5 text-[12.5px] text-slate-700 ' +
                                                            (i === 5 ? 'text-right font-mono' : '')
                                                        }
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-[13px] text-slate-500">
                                Run Preview Results to see sample rows.
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 xl:w-[190px]">
                        <p className="text-[13px] font-bold text-slate-800">Query Info</p>
                        <dl className="mt-3 space-y-3">
                            {[
                                ['Returned Rows', '2,430'],
                                ['Execution Time', '00:00:05'],
                                ['Columns', '8'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between gap-3">
                                    <dt className="text-[12.5px] text-slate-500">{k}</dt>
                                    <dd className="font-mono text-[13px] font-semibold text-blue-600">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </Step>
            <Step n={3} title="Query Parameters">
                <div className="grid gap-4 lg:grid-cols-6 lg:items-end">
                    <div className="flex gap-2">
                        {['Today', 'Yesterday', 'Last 7 Days'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => {
                                    setRange(r)
                                    toast('Parameters set to ' + r)
                                }}
                                className={
                                    'h-10 flex-1 whitespace-nowrap rounded-lg border px-3 text-[13px] font-semibold transition-colors ' +
                                    (range === r
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                                }
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <Field label="Start Date">
                        <input type="date" defaultValue="2025-04-27" className={C.input} />
                    </Field>
                    <Field label="End Date">
                        <input type="date" defaultValue="2025-04-27" className={C.input} />
                    </Field>
                    <Field label="Owner ID">
                        <select className={C.input}>
                            <option>All</option>
                            <option>OPS-01</option>
                            <option>OPS-02</option>
                        </select>
                    </Field>
                    <Field label="Warehouse">
                        <select className={C.input}>
                            <option>All</option>
                            <option>WH1</option>
                            <option>WH2</option>
                        </select>
                    </Field>
                    <Field label="Customer">
                        <select className={C.input}>
                            <option>All</option>
                            <option>Acme Logistics</option>
                            <option>Global Mart</option>
                        </select>
                    </Field>
                </div>
            </Step>
            <Step n={4} title="Report Output">
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
                    <div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <Check checked={d.formats.includes('Excel')} onChange={() => toggleFormat('Excel')}>
                                Excel (.xlsx)
                            </Check>
                            <Check checked={d.formats.includes('PDF')} onChange={() => toggleFormat('PDF')}>
                                PDF (.pdf)
                            </Check>
                            <Check disabled={true}>
                                CSV (.csv)<span className="block text-[11.5px] text-slate-400">(Coming Soon)</span>
                            </Check>
                            <Check disabled={true}>
                                JSON (.json)<span className="block text-[11.5px] text-slate-400">(Coming Soon)</span>
                            </Check>
                        </div>
                        <Field
                            label="File Name Pattern"
                            className="mt-5"
                            hint={
                                'Generates ' +
                                (d.title || 'Report').replace(/\s/g, '') +
                                '-2025-04-28.' +
                                (d.formats[0] === 'PDF' ? 'pdf' : 'xlsx')
                            }
                        >
                            <input
                                type="text"
                                value={d.fileName}
                                onChange={(e) => u('fileName', e.target.value)}
                                className={C.input + ' font-mono text-[13px]'}
                            />
                        </Field>
                    </div>
                    <div>
                        <p className={C.label}>Output Options</p>
                        <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                            {[
                                'Include report title',
                                'Freeze header row',
                                'Include generation date',
                                'Company logo in PDF',
                                'Page numbers in PDF',
                                'Generation timestamp',
                                'Auto-fit Excel columns',
                            ].map((o) => (
                                <Check key={o} checked={true} onChange={() => { }}>
                                    {o}
                                </Check>
                            ))}
                        </div>
                    </div>
                </div>
            </Step>
            <Step
                n={5}
                title="Email Recipients"
                right={
                    <Btn
                        size="sm"
                        icon={Mail}
                        onClick={() => {
                            const t = store.emailTemplates[0]
                            setD((s) => ({
                                ...s,
                                subject: t.subject,
                                body: t.body,
                            }))
                            toast('Applied “' + t.name + '”')
                        }}
                    >
                        Apply email template
                    </Btn>
                }
            >
                <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr_auto] xl:gap-6">
                    <div className="space-y-3">
                        <Chips
                            label="To"
                            required={true}
                            list={d.to}
                            onAdd={(e) => u('to', d.to.concat([e]))}
                            onRemove={(e) =>
                                u(
                                    'to',
                                    d.to.filter((x) => x !== e),
                                )
                            }
                        />
                        <Chips
                            label="CC"
                            list={d.cc}
                            onAdd={(e) => u('cc', d.cc.concat([e]))}
                            onRemove={(e) =>
                                u(
                                    'cc',
                                    d.cc.filter((x) => x !== e),
                                )
                            }
                        />
                        <Chips
                            label="BCC"
                            list={d.bcc}
                            onAdd={(e) => u('bcc', d.bcc.concat([e]))}
                            onRemove={(e) =>
                                u(
                                    'bcc',
                                    d.bcc.filter((x) => x !== e),
                                )
                            }
                        />
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="text-[12.5px] font-semibold text-slate-700">
                                {'Attachment & empty-result rules'}
                            </p>
                            <div className="mt-2.5 space-y-2">
                                <Check checked={d.formats.includes('Excel')} onChange={() => toggleFormat('Excel')}>
                                    Attach Excel
                                </Check>
                                <Check checked={d.formats.includes('PDF')} onChange={() => toggleFormat('PDF')}>
                                    Attach PDF
                                </Check>
                                <Check checked={true} onChange={() => { }}>
                                    Send email even when the query returns zero records
                                </Check>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Field label="Email Subject" required={true}>
                            <input
                                type="text"
                                value={d.subject}
                                onChange={(e) => u('subject', e.target.value)}
                                className={C.input}
                            />
                        </Field>
                        <div>
                            <span className={C.label}>
                                Email Body <span className="text-red-500">*</span>
                            </span>
                            <div className="overflow-hidden rounded-lg border border-slate-300">
                                <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
                                    {[
                                        ['B', 'font-bold'],
                                        ['I', 'italic'],
                                        ['U', 'underline'],
                                        ['S', 'line-through'],
                                    ].map(([t, cls]) => (
                                        <button
                                            key={t}
                                            type="button"
                                            aria-label={'Format ' + t}
                                            onClick={() => toast('Formatting applied')}
                                            className={
                                                'grid h-8 w-8 place-items-center rounded-sm text-[13px] text-slate-600 hover:bg-slate-200 ' +
                                                cls
                                            }
                                        >
                                            {t}
                                        </button>
                                    ))}
                                    <span className="mx-1 h-5 w-px bg-slate-300" />
                                    {[List, ListOrdered, ListIndentIncrease, Table, Link].map((Ic, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            aria-label="Editor tool"
                                            onClick={() => toast('Inserted')}
                                            className="grid h-8 w-8 place-items-center rounded-sm text-slate-600 hover:bg-slate-200"
                                        >
                                            <Ic size={15} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    rows={6}
                                    value={d.body}
                                    onChange={(e) => u('body', e.target.value)}
                                    className="w-full resize-y px-3 py-2.5 text-[13px] leading-relaxed text-slate-700 outline-hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 xl:w-[290px]">
                        <p className="text-[13px] font-bold text-slate-800">Available Variables</p>
                        <dl className="mt-3 space-y-2.5">
                            {VARIABLES.map(([v, desc]) => (
                                <div key={v} className="flex items-start gap-2.5">
                                    <dt>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                u('body', d.body + ' ' + v)
                                                toast(v + ' inserted')
                                            }}
                                            className="rounded-sm bg-blue-50 px-1.5 py-0.5 font-mono text-[11.5px] text-blue-700 hover:bg-blue-100"
                                        >
                                            {v}
                                        </button>
                                    </dt>
                                    <dd className="text-[11.5px] leading-tight text-slate-500">{desc}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </Step>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-5">
                <Step n={6} title="Schedule">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Schedule Type">
                            <select
                                className={C.input}
                                value={d.scheduleType}
                                onChange={(e) => {
                                    u('scheduleType', e.target.value)
                                    u('type', e.target.value)
                                }}
                            >
                                {['Run Once', 'Every X Minutes', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Custom'].map(
                                    (o) => (
                                        <option key={o}>{o}</option>
                                    ),
                                )}
                            </select>
                        </Field>
                        <Field label="Run Time">
                            <input
                                type="time"
                                value={d.runTime}
                                onChange={(e) => u('runTime', e.target.value)}
                                className={C.input}
                            />
                        </Field>
                        <Field label="Timezone">
                            <select className={C.input} value={d.tz} onChange={(e) => u('tz', e.target.value)}>
                                {[
                                    '(UTC+08:00) Singapore',
                                    '(UTC+01:00) Berlin',
                                    '(UTC+00:00) UTC',
                                    '(UTC+05:00) Karachi',
                                ].map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Start Date">
                            <input
                                type="date"
                                value={d.startDate}
                                onChange={(e) => u('startDate', e.target.value)}
                                className={C.input}
                            />
                        </Field>
                        <div>
                            <span className={C.label}>End Date</span>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2.5 text-[13.5px] text-slate-700">
                                    <input
                                        type="radio"
                                        name="end"
                                        checked={!d.endDate}
                                        onChange={() => u('endDate', '')}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    No end date
                                </label>
                                <label className="flex items-center gap-2.5 text-[13.5px] text-slate-700">
                                    <input
                                        type="radio"
                                        name="end"
                                        checked={!!d.endDate}
                                        onChange={() => u('endDate', '2025-12-31')}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    End on
                                </label>
                                <input
                                    type="date"
                                    value={d.endDate}
                                    disabled={!d.endDate}
                                    onChange={(e) => u('endDate', e.target.value)}
                                    className={C.input + ' h-10 disabled:bg-slate-100 disabled:text-slate-400'}
                                />
                            </div>
                        </div>
                        <div>
                            <span className={C.label}>Days of Week (for weekly)</span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {WEEK.map((day) => (
                                    <Check key={day} checked={d.days.includes(day)} onChange={() => toggleDay(day)}>
                                        {day}
                                    </Check>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 sm:col-span-2 lg:col-span-1">
                            <p className="text-[12.5px] font-medium text-emerald-700">Next Run</p>
                            <p className="mt-1 flex items-center gap-2 text-[14px] font-bold text-emerald-800">
                                <CalendarClock size={16} />
                                Apr 28, 2025
                            </p>
                            <p className="text-[14px] font-bold text-emerald-800">{d.runTime}</p>
                        </div>
                    </div>
                </Step>
                <Step n={7} title="Failure &amp; Notification Settings">
                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:gap-6">
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
                                <label className="flex h-11 items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={d.retry}
                                        onChange={() => u('retry', !d.retry)}
                                        className="h-4 w-4 rounded-sm border-slate-300 accent-blue-600"
                                    />
                                    Retry on failure
                                </label>
                                <Field label="Number of retries">
                                    <input
                                        type="number"
                                        value={d.retries}
                                        onChange={(e) => u('retries', Number(e.target.value))}
                                        disabled={!d.retry}
                                        className={C.input + ' disabled:bg-slate-100'}
                                    />
                                </Field>
                                <Field label="Retry interval (minutes)">
                                    <input
                                        type="number"
                                        value={d.retryInterval}
                                        onChange={(e) => u('retryInterval', Number(e.target.value))}
                                        disabled={!d.retry}
                                        className={C.input + ' disabled:bg-slate-100'}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                                <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={d.notifyAdmin}
                                        onChange={() => u('notifyAdmin', !d.notifyAdmin)}
                                        className="h-4 w-4 rounded-sm border-slate-300 accent-blue-600"
                                    />
                                    Notify administrator on failure
                                </label>
                                <label>
                                    <span className="sr-only">Administrator email</span>
                                    <input
                                        type="email"
                                        value={d.adminEmail}
                                        onChange={(e) => u('adminEmail', e.target.value)}
                                        className={C.input}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:w-[300px]">
                            <p className="text-[13px] font-bold text-slate-800">Common Failure Reasons</p>
                            <div className="mt-3 grid grid-cols-1 gap-x-5 gap-y-1.5 sm:grid-cols-2">
                                {FAILURE_REASONS.map((t) => (
                                    <p
                                        key={t}
                                        className="flex items-start gap-1.5 text-[11.5px] leading-tight text-slate-600"
                                    >
                                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                                        {t}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </Step>
            </div>
            <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:flex-row sm:items-center sm:px-6">
                <Btn onClick={() => navigate('/reports')} className="sm:w-[140px]">
                    Cancel
                </Btn>
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
                    <Btn onClick={() => save(false)}>Save Draft</Btn>
                    <Btn variant="primary" onClick={() => save(true)}>
                        {editing ? 'Update & Activate' : 'Save & Activate'}
                    </Btn>
                    <Btn
                        variant="success"
                        icon={Play}
                        onClick={() =>
                            runReport(
                                {
                                    ...d,
                                    title: d.title || 'Untitled report',
                                },
                                true,
                            )
                        }
                    >
                        Run Test
                    </Btn>
                </div>
            </div>
        </>
    )
}
