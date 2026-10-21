import {
    CircleAlert,
    CircleCheck,
    CirclePause,
    Clock,
    Database,
    FileText,
    Mail,
    Play,
    Plus,
    RefreshCw,
    Send,
    Server,
    TrendingUp,
    Zap,
} from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { Card } from '../../components/UI/Card'
import { Empty } from '../../components/UI/Empty'
import { IconBtn } from '../../components/UI/IconBtn'
import { PageHeader } from '../../components/UI/PageHeader'
import { C } from '../../lib/styles'
import { WEEK_RUNS } from '../../mocks/executions'
import { useNavigate } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'

// Ek nazar mein: kitne reports, aaj kya gaya, kya fail hua, aage kya chalega
export function DashboardPage() {
    const { store, toast, runReport } = useAppStore()
    const navigate = useNavigate()
    const { reports, executions, connections, audit } = store
    const active = reports.filter((r) => r.active).length
    const failed = executions.filter((e) => e.status === 'Failed').length
    const maxRun = Math.max(...WEEK_RUNS.map((w) => w.ok + w.fail))
    const upcoming = reports.filter((r) => r.active).slice(0, 5)
    const failures = executions.filter((e) => e.status === 'Failed').slice(0, 4)
    const health = [
        {
            label: 'Scheduler',
            value: 'Online',
            tone: 'text-emerald-600',
            icon: Zap,
        },
        {
            label: 'SMTP relay',
            value: 'Healthy',
            tone: 'text-emerald-600',
            icon: Mail,
        },
        {
            label: 'Connections',
            value: connections.filter((c) => c.status === 'Connected').length + ' / ' + connections.length,
            tone: 'text-amber-600',
            icon: Database,
        },
        {
            label: 'Queue depth',
            value: '3 jobs',
            tone: 'text-slate-700',
            icon: Server,
        },
    ]
    const kpi = [
        {
            v: reports.length,
            l: 'Total Reports',
            i: FileText,
            t: 'bg-blue-50 text-blue-600',
            c: 'text-blue-600',
        },
        {
            v: active,
            l: 'Active Reports',
            i: Play,
            t: 'bg-emerald-50 text-emerald-600',
            c: 'text-emerald-600',
        },
        {
            v: reports.length - active,
            l: 'Disabled Reports',
            i: CirclePause,
            t: 'bg-slate-100 text-slate-500',
            c: 'text-slate-600',
        },
        {
            v: failed,
            l: 'Failed (24 h)',
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
        {
            v: '98.5%',
            l: 'Success Rate (7 d)',
            i: TrendingUp,
            t: 'bg-violet-50 text-violet-600',
            c: 'text-violet-600',
        },
    ]
    return (
        <>
            <PageHeader
                title="Dashboard"
                sub="Live picture of every scheduled SQL report, delivery and failure across the estate."
                actions={
                    <>
                        <Btn variant="primary" icon={Plus} onClick={() => navigate('/reports/new')}>
                            Create Report
                        </Btn>
                        <Btn icon={RefreshCw} onClick={() => toast('Dashboard refreshed')}>
                            Refresh
                        </Btn>
                    </>
                }
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
                {kpi.map((k) => (
                    <div key={k.l} className={C.card + ' flex items-center gap-3 p-4'}>
                        <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-xl ' + k.t}>
                            <k.i size={21} />
                        </span>
                        <div className="min-w-0">
                            <p className={'text-[24px] font-bold leading-none ' + k.c}>{k.v}</p>
                            <p className="mt-1 truncate text-[12.5px] text-slate-500">{k.l}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-3 xl:gap-5">
                <Card
                    className="xl:col-span-2"
                    title="Executions in the last 7 days"
                    sub="Successful versus failed runs per day"
                    right={
                        <div className="flex items-center gap-4 text-[12px] text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-blue-500" />
                                Success
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-red-400" />
                                Failed
                            </span>
                        </div>
                    }
                >
                    <div className="flex h-[220px] items-end gap-3 sm:gap-5">
                        {WEEK_RUNS.map((w) => (
                            <div key={w.d} className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">{w.ok + w.fail}</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    {w.fail > 0 && (
                                        <div
                                            className="w-full rounded-t bg-red-400"
                                            style={{ height: (w.fail / maxRun) * 150 }}
                                            title={w.fail + ' failed'}
                                        />
                                    )}
                                    <div
                                        className={'w-full bg-blue-500 ' + (w.fail ? 'rounded-b' : 'rounded-sm')}
                                        style={{ height: (w.ok / maxRun) * 150 }}
                                        title={w.ok + ' successful'}
                                    />
                                </div>
                                <span className="text-[12px] text-slate-500">{w.d}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card
                    title="System health"
                    sub="Checked every 60 seconds"
                    right={
                        <Btn size="sm" icon={RefreshCw} onClick={() => toast('Health re-checked')}>
                            Check
                        </Btn>
                    }
                >
                    <ul className="space-y-3">
                        {health.map((h) => (
                            <li
                                key={h.label}
                                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                            >
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-500 shadow-xs">
                                    <h.icon size={17} />
                                </span>
                                <span className="text-[13.5px] text-slate-600">{h.label}</span>
                                <span className={'ml-auto text-[13.5px] font-semibold ' + h.tone}>{h.value}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <Btn size="sm" icon={Play} onClick={() => toast('3 due jobs queued')}>
                            Run due jobs
                        </Btn>
                        <Btn size="sm" icon={Database} onClick={() => navigate('/connections')}>
                            Connections
                        </Btn>
                    </div>
                </Card>
            </div>
            <div className="grid gap-4 xl:grid-cols-3 xl:gap-5">
                <Card
                    title="Next scheduled runs"
                    right={
                        <Btn size="sm" onClick={() => navigate('/reports')}>
                            All reports
                        </Btn>
                    }
                >
                    <ul className="divide-y divide-slate-100">
                        {upcoming.map((r) => (
                            <li key={r.id} className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <Clock size={16} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/reports/${r.id}`)}
                                        className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600"
                                    >
                                        {r.title}
                                    </button>
                                    <p className="text-[12px] text-slate-500">
                                        {r.next[0]} · {r.next[1]}
                                    </p>
                                </div>
                                <IconBtn title={'Run ' + r.title} tone="text-emerald-600" onClick={() => runReport(r)}>
                                    <Play size={14} />
                                </IconBtn>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card
                    title="Recent failures"
                    sub={failures.length + ' in the last 24 hours'}
                    right={
                        <Btn size="sm" onClick={() => navigate('/executions')}>
                            History
                        </Btn>
                    }
                >
                    {failures.length === 0 ? (
                        <Empty
                            icon={CircleCheck}
                            title="No failures"
                            text="Every run in the last 24 hours completed."
                        />
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {failures.map((e) => (
                                <li key={e.id} className="flex items-center gap-3 py-2.5">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                                        <CircleAlert size={16} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13.5px] font-semibold text-slate-800">
                                            {e.report}
                                        </p>
                                        <p className="font-mono text-[11.5px] text-slate-500">
                                            {e.id} · {e.started}
                                        </p>
                                    </div>
                                    <Btn size="sm" icon={RefreshCw} onClick={() => toast('Retry queued for ' + e.id)}>
                                        Retry
                                    </Btn>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card
                    title="Recent activity"
                    right={
                        <Btn size="sm" onClick={() => navigate('/audit')}>
                            Audit log
                        </Btn>
                    }
                >
                    <ul className="space-y-3">
                        {audit.slice(0, 6).map((a) => (
                            <li key={a.id} className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">{a.user}</span> · {a.action} · {a.entity}
                                    </p>
                                    <p className="truncate text-[12px] text-slate-500">{a.details}</p>
                                    <p className="text-[11.5px] text-slate-400">{a.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </>
    )
}
