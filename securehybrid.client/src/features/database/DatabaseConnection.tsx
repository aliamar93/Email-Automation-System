import { useState } from 'react'
import { Database, Lock, Pencil, Plus, Trash2, Zap } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { Check } from '../../components/UI/Check'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { Pill } from '../../components/UI/Pill'
import { C } from '../../lib/styles'
import { BLANK_CONN } from '../../mocks/connections'
import { useAppStore } from '../../hooks/useAppStore'
import type { Connection } from '../../types'


// Database connections ki list, add/edit form aur test
export function DatabaseConnection() {
    const { store, setStore, toast, confirm, audit } = useAppStore()
    const [edit, setEdit] = useState<Connection | null>(null)
    const [testing, setTesting] = useState<number | null>(null)

    // Form save: naya ho to add, purana ho to update
    const save = () => {
        if (!edit) return
        if (!edit.name.trim()) {
            toast('Connection name is required')
            return
        }
        if (edit.id) {
            setStore((s) => ({
                ...s,
                connection: s.connections.map((c) => (c.id === edit.id ? edit : c)),
            }))
            audit('Update', 'Connection #' + edit.id, 'Connection "' + edit.name + '"Updated')

            toast('Connection Updated')
        }
        else {
            const id = Math.max(0, ...store.connections.map((c) => c.id)) + 1
            setStore((s) => ({
                ...s,
                connections: s.connections.concat([
                    {
                        ...edit,
                        id,
                        status: 'Connected',
                        lastTested: 'Just Now',
                    },
                ]),
            }))
            audit('Create', 'Connection #' + id, 'Connection "' + edit.name + '"created')
            toast('Connection Created')
        }
        setEdit(null)
    }


    // Test connection: 1.2 second ka nakli test

    const test = (c: Connection) => {
        setTesting(c.id)

        setTimeout(() => {

            setTesting(null)

            const ok = c.status !== 'Error'

            setStore((s) => ({
                ...s,
                connections: s.connections.map((x) =>
                    x.id === c.id
                        ? {
                            ...x,
                            status: ok ? 'Connected' : 'Error',
                            lastTested: 'Just Now',
                        }
                        : x,
                ),
            }))

            audit('Test',
                'Connection #' + c.id,
                ok ? 'Connection test Succeeded' : 'Connection test failed - login timeout',
            )
            toast(ok ? c.name + ' responded in 42 ms ' : c.name + 'failed - login timeout')
        }, 1200)
    }

    return (
        <>
            <PageHeader
                title="Database Connection"
                sub="Credentials are stored server-side and never shown in the interface."
                actions={<Btn variant="primary" icon={Plus} onClick={() => setEdit({ ...BLANK_CONN })}>
                    Add Connection
                </Btn>
                }
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {store.connections.map((c) => (
                    <div key={c.id} className={C.card + ' p-4'}>
                        <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                <Database size={20} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[14.5px] font-bold text-slate-900">{c.name}</p>
                                <p className="text-[12px] text-slate-500">{c.engine}</p>
                            </div>
                            <Pill status={c.status} min={70} />
                        </div>
                        <dl className="mt-4 space-y-1.5 text-[12.5px]">

                            <div className="flex justify-between gap-3">
                                <dt className="text-slate-500">Host</dt>
                                <dd className="truncate font-mono text-slate-700">{c.host}</dd>
                            </div>

                            <div className="flex justify-between gap-3">
                                <dt className="text-slate-500">Database</dt>
                                <dd className="truncate font-mono text-slate-700">{c.database}</dd>
                            </div>

                            <div className="flex justify-between gap-3">
                                <dt className="text-slate-500">User</dt>
                                <dd className="truncate font-mono text-slate-700">{c.user}</dd>
                            </div>

                            <div className="flex justify-between gap-3">
                                <dt className="text-slate-500">Reports</dt>
                                <dd className="truncate font-mono text-slate-700">{c.reports}</dd>
                            </div>

                            <div className="flex justify-between gap-3">
                                <dt className="text-slate-500">Last Tested</dt>
                                <dd className="truncate font-mono text-slate-700">{c.lastTested}</dd>
                            </div>
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {c.ssl && (
                                <span className={C.chip + ' bg-emerald-50 text-emerald-700'}>
                                    <Lock size={12} />
                                    SSL
                                </span>
                            )}
                            {c.readOnly && <span className={C.chip + ' bg-slate-100 text-slate-600'}>Read Only</span>}
                        </div>
                        <div className="mt-4 flex-gap-2">
                            <Btn
                                size="sm"
                                icon={Zap}
                                onClick={() => test(c)}
                                className="flex-1"
                                disabled={testing === c.id}
                            >
                                {testing === c.id ? 'Testing...' : 'Test'}
                            </Btn>

                            <IconBtn title="Edit connection" tone="text-blue-600" onClick={() =>
                                setEdit({ ...c })
                            }>
                                <Pencil size={15} />
                            </IconBtn>
                            <IconBtn title="Delete Connection"
                                tone="text-red-500"
                                onClick={() =>
                                    confirm({
                                        title: 'Delete "' + c.name + '"?', danger: true,
                                        confirmLabel: 'Delete Connection',
                                        body:
                                            c.reports + ' reports use this connection and will fail on their next run until they are pointed at another source.',
                                        onConfirm: () => {
                                            setStore((s) => ({
                                                ...s,
                                                connections: s.connections.filter((x) => x.id !== c.id),
                                            }))
                                            audit('Delete', 'Connection # ' + c.id, 'Connection deleted')
                                            toast('Connection deleted')
                                        },
                                    })
                                }
                            >
                                <Trash2 size={15} />
                            </IconBtn>

                        </div>
                    </div>
                ))}
            </div>
            <Modal open={!!edit}
                size="md"
                onClose={() => setEdit(null)}
                title={edit && edit.id ? 'Edit Connection' : 'Add Connection'}
                sub="The Password is Encrypted server-side and is never returned to the browser."
                footer={
                    <>
                        <Btn onClick={() => setEdit(null)}>Cancel</Btn>
                        <Btn icon={Zap} onClick={() => toast('Connection Test succeeded')}>
                            Test Connection
                        </Btn>
                        <Btn variant="primary" onClick={save}>
                            {edit && edit.id ? 'Save Changes' : 'Create Connection'}
                        </Btn>
                    </>
                }
            >

                {edit && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Connection Name" required={true} className="sm:cols-span-2">
                            <input type="text"
                                value={edit.name}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        name: e.target.value
                                    })
                                }
                                className={C.input}
                            />
                        </Field>
                        <Field label="Engine">
                            <select
                                className={C.input}
                                value={edit.engine}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        engine: e.target.value,
                                    })
                                }
                            >

                                {['SQL Server', 'PostgreSQL', 'Oracle', 'Azure SQL', 'Microsoft Fabric'].map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Port">
                            <input type="number" value={edit.port}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        port: Number(e.target.value)
                                    })
                                }
                                className={C.input}
                            />
                        </Field>
                        <Field label="Host" className="sm:col-span-2">
                            <input type="text"
                                value={edit.host}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        host: e.target.value,
                                    })
                                }
                                placeholder="server.corp.local"
                                className={C.input + ' font-mono text-[13px]'}
                            />
                        </Field>
                        <Field label="Database">
                            <input
                                type="text"
                                value={edit.database}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        database: e.target.value,
                                    })
                                }
                                className={C.input + ' font-mono text-[13px]'}
                            />
                        </Field>
                        <Field label="Username">
                            <input
                                type="text"
                                value={edit.user}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        user: e.target.value,
                                    })
                                }
                                className={C.input + ' font-mono text-[13px]'}
                            />
                        </Field>
                        <Field
                            label="Password"
                            className="sm:col-span-2"
                            hint="Stored encrypted. Leave blank to keep the existing password."
                        >
                            <input
                                type="password"
                                value={edit.password || ''}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="••••••••"
                                className={C.input}
                            />
                        </Field>
                        <div className="sm:col-span-2 space-y-2.5">
                            <Check
                                checked={edit.ssl}
                                onChange={() =>
                                    setEdit({
                                        ...edit,
                                        ssl: !edit.ssl,
                                    })
                                }
                            >
                                Require SSL/TLS
                            </Check>
                            <Check
                                checked={edit.readOnly}
                                onChange={() =>
                                    setEdit({
                                        ...edit,
                                        readOnly: !edit.readOnly,
                                    })
                                }
                            >
                                Read-only user (recommended — blocks write statements)
                            </Check>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}


// import { PageHeader } from '../../components/UI/PageHeader'


// export function DatabaseConnection() {
//     return (
//         <>
//             <PageHeader title="Database Connections" subtitle="Credentials are stored server-side and never shown in the interface." />

//             <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-500">Credentials are stored server-side.</div>
//         </>
//     )
// }