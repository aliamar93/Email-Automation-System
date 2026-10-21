import { useState } from 'react'
import { Download } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { DataTable } from '../../components/UI/DataTable'
import { Field } from '../../components/UI/Field'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { C } from '../../lib/styles'
import { useAppStore } from '../../hooks/useAppStore'
import type { AuditEntry } from '../../types'

// Kis ne kya banaya, badla, chalaya ya band kiya — aur kab
export function AuditPage() {
    const { store, toast } = useAppStore()
    const [f, setF] = useState({
        q: '',
        action: 'All',
        user: 'All',
    })
    const [row, setRow] = useState<AuditEntry | null>(null)
    const rows = store.audit.filter(
        (a) =>
            (!f.q || (a.details + a.entity).toLowerCase().includes(f.q.toLowerCase())) &&
            (f.action === 'All' || a.action === f.action) &&
            (f.user === 'All' || a.user === f.user),
    )
    // Har action ka apna rang
    const tone: Record<string, string> = {
        Create: 'bg-emerald-50 text-emerald-700',
        Update: 'bg-blue-50 text-blue-700',
        Delete: 'bg-red-50 text-red-600',
        Execute: 'bg-violet-50 text-violet-700',
        Failure: 'bg-red-50 text-red-600',
        Security: 'bg-amber-50 text-amber-700',
        Disable: 'bg-slate-100 text-slate-600',
        Enable: 'bg-emerald-50 text-emerald-700',
        Test: 'bg-sky-50 text-sky-700',
    }
    return (
        <>
            <PageHeader
                title="Audit Logs"
                sub="Who created, changed, ran or disabled a report — and when."
                actions={
                    <Btn icon={Download} onClick={() => toast('Audit log exported')}>
                        Export
                    </Btn>
                }
            />
            <div className={C.card + ' p-4'}>
                <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
                    <Field label="Action">
                        <select
                            className={C.input}
                            value={f.action}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    action: e.target.value,
                                })
                            }
                        >
                            {[
                                'All',
                                'Create',
                                'Update',
                                'Delete',
                                'Execute',
                                'Failure',
                                'Security',
                                'Disable',
                                'Enable',
                                'Test',
                            ].map((o) => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="User">
                        <select
                            className={C.input}
                            value={f.user}
                            onChange={(e) =>
                                setF({
                                    ...f,
                                    user: e.target.value,
                                })
                            }
                        >
                            {['All', 'John Doe', 'Sarah Chen', 'A. Fischer', 'Admin', 'System'].map((o) => (
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
                            placeholder="Entity or detail"
                            className={C.input}
                        />
                    </Field>
                </div>
            </div>
            <section className={C.card + ' overflow-hidden'}>
                <DataTable
                    minWidth={900}
                    rows={rows}
                    onRowClick={setRow}
                    cols={[
                        {
                            key: 'time',
                            label: 'Timestamp',
                            primary: true,
                            cell: (a) => <span className="text-[13px] font-semibold text-slate-700">{a.time}</span>,
                        },
                        {
                            key: 'user',
                            label: 'User',
                            cell: (a) => a.user,
                        },
                        {
                            key: 'action',
                            label: 'Action',
                            cell: (a) => (
                                <span className={C.chip + ' ' + (tone[a.action] || 'bg-slate-100 text-slate-600')}>
                                    {a.action}
                                </span>
                            ),
                        },
                        {
                            key: 'entity',
                            label: 'Entity',
                            cell: (a) => a.entity,
                        },
                        {
                            key: 'details',
                            label: 'Details',
                            cell: (a) => a.details,
                        },
                        {
                            key: 'ip',
                            label: 'IP',
                            cell: (a) => <span className="font-mono text-[12.5px]">{a.ip}</span>,
                        },
                    ]}
                />
            </section>
            <Modal
                open={!!row}
                size="sm"
                onClose={() => setRow(null)}
                title="Audit entry"
                footer={<Btn onClick={() => setRow(null)}>Close</Btn>}
            >
                {row && (
                    <dl className="space-y-3">
                        {[
                            ['Timestamp', row.time],
                            ['User', row.user],
                            ['Action', row.action],
                            ['Entity', row.entity],
                            ['Details', row.details],
                            ['Source IP', row.ip],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <dt className="text-[12px] text-slate-500">{k}</dt>
                                <dd className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{v}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </Modal>
        </>
    )
}
