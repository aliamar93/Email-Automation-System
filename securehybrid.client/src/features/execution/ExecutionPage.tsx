import { useMemo, useState } from 'react'
import { Download, Eye, RefreshCw } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { DataTable } from '../../components/UI/DataTable'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { Pager } from '../../components/UI/Pager'
import { Pill } from '../../components/UI/Pill'
import { C } from '../../lib/styles'
import { SEED_LOG } from '../../mocks/executions'
import { useNavigate } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { Execution } from '../../types'
import type { ReactNode } from 'react'

// Har scheduled, manual aur retry run — log aur files ke saath
export function ExecutionPage() {
    const { store, toast } = useAppStore()
    const navigate = useNavigate()
    const [f, setF] = useState({
        q: '',
        status: 'All',
        trigger: 'All',
        report: 'All',
    })
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(8)
    const [log, setLog] = useState<Execution | null>(null)
    const rows = useMemo(() => {
        const q = f.q.trim().toLowerCase()
        return store.executions.filter(
            (e) =>
                (!q || e.id.toLowerCase().includes(q) || e.report.toLowerCase().includes(q)) &&
                (f.status === 'All' || e.status === f.status) &&
                (f.trigger === 'All' || e.trigger === f.trigger) &&
                (f.report === 'All' || e.report === f.report),
        )
    }, [store.executions, f])
    const paged = rows.slice((page - 1) * perPage, page * perPage)
    const stat = (s: string) => store.executions.filter((e) => e.status === s).length
    return (
        <>
            <PageHeader
                title="Execution History"
                sub="Every scheduled, manual and retried run, with its log and generated files."
                actions={
                    <>
                        <Btn icon={Download} onClick={() => toast('Execution log exported as CSV')}>
                            Export CSV
                        </Btn>
                        <Btn icon={RefreshCw} onClick={() => toast('History refreshed')}>
                            Refresh
                        </Btn>
                    </>
                }
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                    ['Runs today', store.executions.length, 'text-slate-900'],
                    ['Successful', stat('Success'), 'text-emerald-600'],
                    ['Failed', stat('Failed'), 'text-red-600'],
                    ['Running', stat('Running'), 'text-blue-600'],
                ].map(([l, v, c]) => (
                    <div key={l} className={C.card + ' p-4'}>
                        <p className="text-[12.5px] text-slate-500">{l}</p>
                        <p className={'mt-1 text-[24px] font-bold ' + c}>{v}</p>
                    </div>
                ))}
            </div>
            <div className={C.card + ' p-4'}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    <Field label="Report">
                        <select
                            className={C.input}
                            value={f.report}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    report: e.target.value,
                                })
                            }
                        >
                            {['All'].concat(store.reports.map((r) => r.title)).map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Status">
                        <select
                            className={C.input}
                            value={f.status}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    status: e.target.value,
                                })
                            }
                        >
                            {['All', 'Success', 'Partially Completed', 'Failed', 'Running'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Trigger Type">
                        <select
                            className={C.input}
                            value={f.trigger}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    trigger: e.target.value,
                                })
                            }
                        >
                            {['All', 'Schedule', 'Manual', 'Retry'].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Search">
                        <input
                            type="search"
                            value={f.q}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    q: e.target.value,
                                })
                            }
                            placeholder="Execution ID or report"
                            className={C.input}
                        />
                    </Field>
                </div>
            </div>
            <section className={C.card + ' overflow-hidden'}>
                <DataTable
                    minWidth={1240}
                    rows={paged}
                    cols={[
                        {
                            key: 'id',
                            label: 'Execution ID',
                            primary: true,
                            cell: (e) => (
                                <span className="font-mono text-[12.5px] font-semibold text-slate-700">{e.id}</span>
                            ),
                        },
                        {
                            key: 'report',
                            label: 'Report',
                            cell: (e) => (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/reports/${e.reportId}`)}
                                    className="font-medium text-slate-800 hover:text-blue-600"
                                >
                                    {e.report}
                                </button>
                            ),
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
                            label: 'Records',
                            align: 'right',
                            cell: (e) => <span className="font-mono text-[12.5px]">{e.rows}</span>,
                        },
                        {
                            key: 'files',
                            label: 'Files',
                            align: 'right',
                            cell: (e) => <span className="font-mono text-[12.5px]">{e.files}</span>,
                        },
                        {
                            key: 'email',
                            label: 'Email',
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
                            label: 'Trigger',
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
                                    <IconBtn title="View log" tone="text-blue-600" onClick={() => setLog(e)}>
                                        <Eye size={15} />
                                    </IconBtn>
                                    <IconBtn title="Download files" onClick={() => toast('Files downloaded')}>
                                        <Download size={15} />
                                    </IconBtn>
                                    <IconBtn
                                        title="Retry"
                                        tone="text-emerald-600"
                                        onClick={() => toast('Retry queued for ' + e.id)}
                                    >
                                        <RefreshCw size={15} />
                                    </IconBtn>
                                </div>
                            ),
                        },
                    ]}
                />
                <Pager page={page} setPage={setPage} total={rows.length} perPage={perPage} setPerPage={setPerPage} />
            </section>
            <Modal
                open={!!log}
                size="lg"
                onClose={() => setLog(null)}
                title={log ? 'Execution Log — ' + log.id : ''}
                sub={log ? log.report + ' · ' + log.trigger + ' · ' + log.started : ''}
                footer={
                    <>
                        <Btn onClick={() => setLog(null)}>Close</Btn>
                        <Btn icon={Download} onClick={() => toast('Log downloaded')}>
                            Download Log
                        </Btn>
                        <Btn
                            variant="primary"
                            icon={RefreshCw}
                            onClick={() => {
                                toast('Retry queued')
                                setLog(null)
                            }}
                        >
                            Retry run
                        </Btn>
                    </>
                }
            >
                {log && (
                    <div className="space-y-4">
                        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {(
                                [
                                    ['Status', <Pill status={log.status} />],
                                    ['Duration', log.dur],
                                    ['Records', log.rows],
                                    ['Files', log.files],
                                ] as [string, ReactNode][]
                            ).map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-[12px] text-slate-500">{k}</dt>
                                    <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="overflow-x-auto rounded-lg bg-slate-900 p-4">
                            <pre className="font-mono text-[12.5px] leading-relaxed text-slate-100">
                                {SEED_LOG.map(([t, lvl, msg], i) => (
                                    <div key={i} className="whitespace-pre">
                                        <span className="select-none pr-3 text-slate-500">
                                            {String(i + 1).padStart(2, ' ')}
                                        </span>
                                        <span className="text-slate-400">{t}</span>
                                        <span
                                            className={
                                                'px-2 ' +
                                                (log.status === 'Failed' && i > 3 ? 'text-red-400' : 'text-emerald-400')
                                            }
                                        >
                                            [{log.status === 'Failed' && i > 3 ? 'ERROR' : lvl}]
                                        </span>
                                        {log.status === 'Failed' && i > 3
                                            ? "Query failed — Invalid object name 'dbo.PurchaseOrders'"
                                            : msg}
                                    </div>
                                ))}
                            </pre>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}