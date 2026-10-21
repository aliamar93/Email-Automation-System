import { useState } from 'react'
import type { ReactNode } from 'react'
import {
    Ban,
    ChevronDown,
    CircleAlert,
    CircleCheck,
    Clock,
    Copy,
    Download,
    Eye,
    FileText,
    History,
    Paperclip,
    Pencil,
    Play,
    RefreshCw,
    Send,
    Settings,
    Trash2,
    Users,
} from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { Card } from '../../components/UI/Card'
import { DataTable } from '../../components/UI/DataTable'
import { Empty } from '../../components/UI/Empty'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { PageHeader } from '../../components/UI/PageHeader'
import { Pill } from '../../components/UI/Pill'
import { SqlEditor } from '../../components/UI/SqlEditor'
import { C } from '../../lib/styles'
import { SEED_LOG } from '../../mocks/executions'
import { ROADMAP } from '../../mocks/reference'
import { useNavigate, useParams } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { LucideIcon } from 'lucide-react'
import type { Execution, Report } from '../../types'

// Upar wali details grid ka ek khana
function Meta({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="px-4 py-4 sm:px-5">
            <dt className="text-[12.5px] text-slate-500">{label}</dt>
            <dd className="mt-1 text-[14px] font-semibold text-slate-800">{children}</dd>
        </div>
    )
}

interface ReportDetailProps {
    report?: Report
}

// URL se report id lo (/reports/:id) aur detail dikhao
export function ReportDetailPage() {
    const { id } = useParams()
    const { store } = useAppStore()
    const report = store.reports.find((r) => r.id === Number(id))
    return <ReportDetail key={id} report={report} />
}

// Ek report ki poori detail: config, history, recipients, attachments, audit
function ReportDetail({ report }: ReportDetailProps) {
    const { store, setStore, toast, runReport, confirm, audit } = useAppStore()
    const navigate = useNavigate()
    const [tab, setTab] = useState('Execution History')
    const [logOpen, setLogOpen] = useState(true)
    const [logFor, setLogFor] = useState<Execution | null>(null)
    if (!report)
        return (
            <Empty
                title="Report not found"
                text="It may have been deleted."
                action={
                    <Btn variant="primary" onClick={() => navigate('/reports')}>
                        Back to reports
                    </Btn>
                }
            />
        )
    const execs = store.executions.filter((e) => e.reportId === report.id)
    const tabs: [string, LucideIcon][] = [
        ['Execution History', History],
        ['Configuration', Settings],
        ['Recipients (' + report.to.length + ')', Users],
        ['Attachments', Paperclip],
        ['Audit Logs', FileText],
    ]
    const setActive = (v: boolean) => {
        setStore((s) => ({
            ...s,
            reports: s.reports.map((r) =>
                r.id === report.id
                    ? {
                        ...r,
                        active: v,
                        status: v ? 'Pending' : 'Disabled',
                    }
                    : r,
            ),
        }))
        audit(
            v ? 'Enable' : 'Disable',
            'Report #' + report.id,
            v ? 'Report enabled from detail view' : 'Report disabled from detail view',
        )
        toast(v ? 'Report enabled' : 'Report disabled')
    }
    return (
        <>
            <PageHeader
                title="Report Details"
                sub="View report configuration, execution history and manage this report."
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
                        <span className="text-slate-500">#{report.id}</span>
                    </nav>
                }
                actions={
                    <>
                        <Btn icon={Pencil} onClick={() => navigate(`/reports/${report.id}/edit`)}>
                            Edit
                        </Btn>
                        <Btn variant="primary" icon={Play} onClick={() => runReport(report)}>
                            Run Now
                        </Btn>
                        {report.active ? (
                            <Btn
                                variant="danger"
                                icon={Ban}
                                onClick={() =>
                                    confirm({
                                        title: 'Disable this report?',
                                        body: 'The schedule stops immediately. No emails are sent until it is enabled again.',
                                        confirmLabel: 'Disable',
                                        onConfirm: () => setActive(false),
                                    })
                                }
                            >
                                Disable
                            </Btn>
                        ) : (
                            <Btn variant="success" icon={Play} onClick={() => setActive(true)}>
                                Enable
                            </Btn>
                        )}
                        <Btn icon={Copy} onClick={() => toast('Report duplicated')}>
                            Duplicate
                        </Btn>
                        <Btn icon={Clock} onClick={() => setTab('Execution History')}>
                            View History
                        </Btn>
                    </>
                }
            />
            <section className={C.card + ' overflow-hidden'}>
                <div className="flex flex-wrap items-start gap-4 p-4 sm:p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[19px] font-bold text-slate-900">{report.title}</h2>
                        <p className="mt-0.5 text-[13.5px] text-slate-500">{report.description}</p>
                    </div>
                    <span
                        className={
                            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold ' +
                            (report.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')
                        }
                    >
                        <span
                            className={'h-2 w-2 rounded-full ' + (report.active ? 'bg-emerald-500' : 'bg-slate-400')}
                        />
                        {report.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <dl
                    className={
                        'grid grid-cols-1 border-t border-slate-100 sm:grid-cols-2 xl:grid-cols-4 [&>div]:border-b [&>div]:border-slate-100 sm:[&>div]:border-r'
                    }
                >
                    <Meta label="Created By">{report.createdBy}</Meta>
                    <Meta label="Created Date">{report.createdAt}</Meta>
                    <Meta label="Last Modified By">{report.modifiedBy}</Meta>
                    <Meta label="Last Modified Date">{report.modifiedAt}</Meta>
                    <Meta label="Schedule">
                        {report.type} ({report.detail})
                    </Meta>
                    <Meta label="Recipients">
                        {report.to.map((e) => (
                            <span key={e} className="block">
                                {e}
                            </span>
                        ))}
                    </Meta>
                    <Meta label="Database">{report.db}</Meta>
                    <Meta label="Output Formats">{report.formats.join(', ')}</Meta>
                </dl>
                <dl
                    className={
                        'grid grid-cols-1 sm:grid-cols-2 sm:[&>div:first-child]:border-r sm:[&>div]:border-slate-100'
                    }
                >
                    <Meta label="Last Execution">
                        {report.last.join(' ')}
                        <span className="mt-1.5 flex items-center gap-2 text-[13.5px] font-medium text-emerald-600">
                            <CircleCheck size={16} />
                            {report.status} · 1,245 records
                        </span>
                    </Meta>
                    <Meta label="Next Execution">
                        {report.next.join(' ')}
                        <span className="mt-1.5 flex items-center gap-2 text-[13.5px] font-medium text-slate-500">
                            <Clock size={16} />
                            In 45 minutes
                        </span>
                    </Meta>
                </dl>
            </section>
            <section className={C.card + ' overflow-hidden'}>
                <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/60 px-2 pt-2">
                    {tabs.map(([label, Icon]) => {
                        const on = tab === label
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setTab(label)}
                                aria-current={on ? 'page' : undefined}
                                className={
                                    'flex shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-[13.5px] font-medium transition-colors ' +
                                    (on
                                        ? 'border-blue-600 bg-white text-blue-700'
                                        : 'border-transparent text-slate-600 hover:text-slate-900')
                                }
                            >
                                <Icon size={17} />
                                {label}
                            </button>
                        )
                    })}
                </div>
                {tab === 'Execution History' && (
                    <>
                        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end">
                            <div className="lg:flex-1">
                                <h3 className="text-[17px] font-bold text-slate-900">Execution History</h3>
                                <p className="mt-1 text-[13.5px] text-slate-500">
                                    View the execution history and details for this report.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                                <Field label="Date Range">
                                    <select className={C.input}>
                                        {['Last 7 days', 'Last 24 hours', 'Last 30 days', 'Custom'].map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Status">
                                    <select className={C.input}>
                                        {['All', 'Success', 'Partially Completed', 'Failed', 'Running'].map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Trigger Type">
                                    <select className={C.input}>
                                        {['All', 'Schedule', 'Manual', 'Retry'].map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Search">
                                    <input type="search" placeholder="Search executions..." className={C.input} />
                                </Field>
                            </div>
                        </div>
                        <DataTable
                            minWidth={1240}
                            rows={execs}
                            empty={
                                <Empty
                                    title="No executions yet"
                                    text="Run the report to create the first execution record."
                                    action={
                                        <Btn variant="primary" icon={Play} onClick={() => runReport(report)}>
                                            Run Now
                                        </Btn>
                                    }
                                />
                            }
                            cols={[
                                {
                                    key: 'id',
                                    label: 'Execution ID',
                                    primary: true,
                                    cell: (e) => (
                                        <span className="font-mono text-[12.5px] font-semibold text-slate-700">
                                            {e.id}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'report',
                                    label: 'Report',
                                    cell: () => report.title,
                                },
                                {
                                    key: 'started',
                                    label: 'Started At',
                                    cell: (e) => e.started,
                                },
                                {
                                    key: 'finished',
                                    label: 'Finished At',
                                    cell: (e) => e.finished,
                                },
                                {
                                    key: 'dur',
                                    label: 'Duration',
                                    align: 'right',
                                    cell: (e) => <span className="font-mono text-[12.5px]">{e.dur}</span>,
                                },
                                {
                                    key: 'rows',
                                    label: 'Records Returned',
                                    align: 'right',
                                    cell: (e) => <span className="font-mono text-[12.5px]">{e.rows}</span>,
                                },
                                {
                                    key: 'files',
                                    label: 'Files Generated',
                                    align: 'right',
                                    cell: (e) => <span className="font-mono text-[12.5px]">{e.files}</span>,
                                },
                                {
                                    key: 'email',
                                    label: 'Email Status',
                                    cell: (e) =>
                                        e.email === '-' ? (
                                            <span className="text-slate-400">-</span>
                                        ) : (
                                            <Pill status={e.email === 'Sent' ? 'Sent' : 'Failed'} min={60} />
                                        ),
                                },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    cell: (e) => <Pill status={e.status} min={92} />,
                                },
                                {
                                    key: 'trigger',
                                    label: 'Trigger Type',
                                    cell: (e) => e.trigger,
                                },
                                {
                                    key: 'by',
                                    label: 'Executed By',
                                    cell: (e) => e.by,
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    cell: (e) => (
                                        <div className="flex gap-1.5">
                                            <IconBtn
                                                title="View log"
                                                tone="text-blue-600"
                                                onClick={() => {
                                                    setLogFor(e)
                                                    setLogOpen(true)
                                                }}
                                            >
                                                <Eye size={15} />
                                            </IconBtn>
                                            <IconBtn title="Download files" onClick={() => toast('Files downloaded')}>
                                                <Download size={15} />
                                            </IconBtn>
                                            <IconBtn
                                                title="Re-run"
                                                tone="text-emerald-600"
                                                onClick={() => runReport(report)}
                                            >
                                                <RefreshCw size={15} />
                                            </IconBtn>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </>
                )}
                {tab === 'Configuration' && (
                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <p className={C.label}>SQL query</p>
                                <SqlEditor value={report.sql} onChange={() => { }} readOnly={true} rows={12} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    ['Database', report.db],
                                    ['Query timeout', report.timeout + ' s'],
                                    ['Row limit', '50,000'],
                                    ['File name', report.fileName],
                                ].map(([k, v]) => (
                                    <div key={k}>
                                        <p className="text-[12px] text-slate-500">{k}</p>
                                        <p className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card title="Schedule" pad={true}>
                                <dl className="grid grid-cols-2 gap-4">
                                    {[
                                        ['Type', report.scheduleType],
                                        ['Run time', report.runTime],
                                        ['Timezone', report.tz],
                                        ['Start date', report.startDate],
                                        ['End date', report.endDate || 'No end date'],
                                        ['Days', report.days.join(', ')],
                                    ].map(([k, v]) => (
                                        <div key={k}>
                                            <dt className="text-[12px] text-slate-500">{k}</dt>
                                            <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Card>
                            <Card title="Failure handling" pad={true}>
                                <dl className="grid grid-cols-2 gap-4">
                                    {[
                                        ['Retry on failure', report.retry ? 'Yes' : 'No'],
                                        ['Retries', report.retries],
                                        ['Interval', report.retryInterval + ' min'],
                                        ['Notify admin', report.adminEmail],
                                    ].map(([k, v]) => (
                                        <div key={k}>
                                            <dt className="text-[12px] text-slate-500">{k}</dt>
                                            <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Card>
                            <Btn icon={Pencil} onClick={() => navigate(`/reports/${report.id}/edit`)}>
                                Edit configuration
                            </Btn>
                        </div>
                    </div>
                )}
                {tab.startsWith('Recipients') && (
                    <div className="p-4 sm:p-5">
                        <div className="grid gap-5 xl:grid-cols-2">
                            <Card
                                title="Delivery list"
                                right={
                                    <Btn size="sm" icon={Pencil} onClick={() => navigate(`/reports/${report.id}/edit`)}>
                                        Edit
                                    </Btn>
                                }
                            >
                                {(
                                    [
                                        ['To', report.to],
                                        ['CC', report.cc],
                                        ['BCC', report.bcc],
                                    ] as [string, string[]][]
                                ).map(([k, list]) => (
                                    <div key={k} className="mb-4 last:mb-0">
                                        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                                            {k}
                                        </p>
                                        {list.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {list.map((e) => (
                                                    <span key={e} className={C.chip + ' bg-blue-50 text-blue-700'}>
                                                        {e}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[13px] text-slate-400">None</p>
                                        )}
                                    </div>
                                ))}
                            </Card>
                            <Card
                                title="Email preview"
                                right={
                                    <Btn size="sm" icon={Send} onClick={() => toast('Test email sent to you')}>
                                        Send test
                                    </Btn>
                                }
                            >
                                <p className="text-[12px] text-slate-500">Subject</p>
                                <p className="mb-3 text-[14px] font-semibold text-slate-800">{report.subject}</p>
                                <p className="text-[12px] text-slate-500">Body</p>
                                <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-700">
                                    {report.body}
                                </pre>
                            </Card>
                        </div>
                    </div>
                )}
                {tab === 'Attachments' && (
                    <div className="p-4 sm:p-5">
                        <DataTable
                            minWidth={700}
                            rows={[
                                {
                                    id: 1,
                                    file: report.title.replace(/\s/g, '') + '_2025-04-27.xlsx',
                                    type: 'Excel',
                                    size: '245 KB',
                                    run: 'EX-2025-0427-000',
                                    when: 'Apr 27, 2025 07:04 AM',
                                },
                                {
                                    id: 2,
                                    file: report.title.replace(/\s/g, '') + '_2025-04-27.pdf',
                                    type: 'PDF',
                                    size: '182 KB',
                                    run: 'EX-2025-0427-000',
                                    when: 'Apr 27, 2025 07:04 AM',
                                },
                                {
                                    id: 3,
                                    file: report.title.replace(/\s/g, '') + '_2025-04-26.xlsx',
                                    type: 'Excel',
                                    size: '240 KB',
                                    run: 'EX-2025-0426-021',
                                    when: 'Apr 26, 2025 11:14 AM',
                                },
                            ]}
                            cols={[
                                {
                                    key: 'file',
                                    label: 'File',
                                    primary: true,
                                    cell: (a) => (
                                        <span className="font-mono text-[12.5px] font-semibold text-slate-700">
                                            {a.file}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'type',
                                    label: 'Type',
                                    cell: (a) => (
                                        <span className={C.chip + ' bg-slate-100 text-slate-600'}>{a.type}</span>
                                    ),
                                },
                                {
                                    key: 'size',
                                    label: 'Size',
                                    cell: (a) => a.size,
                                },
                                {
                                    key: 'run',
                                    label: 'Execution',
                                    cell: (a) => <span className="font-mono text-[12.5px]">{a.run}</span>,
                                },
                                {
                                    key: 'when',
                                    label: 'Generated',
                                    cell: (a) => a.when,
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    cell: (a) => (
                                        <div className="flex gap-1.5">
                                            <IconBtn
                                                title="Download"
                                                tone="text-blue-600"
                                                onClick={() => toast('Downloading ' + a.file)}
                                            >
                                                <Download size={15} />
                                            </IconBtn>
                                            <IconBtn
                                                title="Re-send by email"
                                                onClick={() => toast('Re-sent to recipients')}
                                            >
                                                <Send size={15} />
                                            </IconBtn>
                                            <IconBtn
                                                title="Delete"
                                                tone="text-red-500"
                                                onClick={() => toast('Attachment removed')}
                                            >
                                                <Trash2 size={15} />
                                            </IconBtn>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}
                {tab === 'Audit Logs' && (
                    <div className="p-4 sm:p-5">
                        <ul className="space-y-4">
                            {store.audit
                                .filter((a) => a.entity.includes('#' + report.id))
                                .concat(store.audit.slice(0, 3))
                                .slice(0, 6)
                                .map((a, i) => (
                                    <li key={a.id + '-' + i} className="flex gap-3">
                                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                        <div>
                                            <p className="text-[13.5px] text-slate-700">
                                                <span className="font-semibold">{a.user}</span> · {a.action} ·{' '}
                                                {a.entity}
                                            </p>
                                            <p className="text-[12.5px] text-slate-500">{a.details}</p>
                                            <p className="text-[11.5px] text-slate-400">
                                                {a.time} · {a.ip}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </section>
            <section className={C.card + ' overflow-hidden'}>
                <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                    <button
                        type="button"
                        onClick={() => setLogOpen(!logOpen)}
                        aria-expanded={logOpen}
                        className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900"
                    >
                        <span className={'text-slate-400 transition-transform ' + (logOpen ? '' : '-rotate-90')}>
                            <ChevronDown size={18} />
                        </span>
                        Execution Log — {logFor ? logFor.id : execs[0] ? execs[0].id : 'latest'}
                    </button>
                    <Btn size="sm" icon={Download} onClick={() => toast('Log downloaded')} className="ml-auto">
                        Download Log
                    </Btn>
                </div>
                {logOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                        <div className="overflow-x-auto rounded-lg bg-slate-900 p-4">
                            <pre className="font-mono text-[12.5px] leading-relaxed text-slate-100">
                                {SEED_LOG.map(([t, lvl, msg], i) => (
                                    <div key={i} className="whitespace-pre">
                                        <span className="select-none pr-3 text-slate-500">
                                            {String(i + 1).padStart(2, ' ')}
                                        </span>
                                        <span className="text-slate-400">{t}</span>
                                        <span className="px-2 text-emerald-400">[{lvl}]</span>
                                        {msg}
                                    </div>
                                ))}
                            </pre>
                        </div>
                    </div>
                )}
            </section>
            <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
                <p className="flex items-center gap-2 text-[13.5px] font-semibold text-blue-700">
                    <CircleAlert size={16} />
                    Additional Capabilities (Roadmap)
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
                    {ROADMAP.map(({ label, icon: Icon, tone }) => (
                        <li key={label} className="flex items-center gap-2.5">
                            <span className={tone}>
                                <Icon size={19} />
                            </span>
                            <span className="text-[12.5px] font-medium leading-tight text-slate-600">{label}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
