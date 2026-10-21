import { useState } from 'react'
import { Pencil, Send, Users } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { Check } from '../../components/UI/Check'
import { DataTable } from '../../components/UI/DataTable'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { PageHeader } from '../../components/UI/PageHeader'
import { C } from '../../lib/styles'
import { useAppStore } from '../../hooks/useAppStore'
import type { Settings } from '../../types'

// Workspace, email, security aur retention ki settings
export function SettingsPage() {
    const { store, setStore, toast, audit } = useAppStore()
    const [tab, setTab] = useState('General')
    const [s, setS] = useState(store.settings)
    // Ek setting badlo (save tab hota hai jab "Save changes" dabao)
    const u = <K extends keyof Settings>(k: K, v: Settings[K]) =>
        setS((x) => ({
            ...x,
            [k]: v,
        }))
    const save = () => {
        setStore((st) => ({
            ...st,
            settings: s,
        }))
        audit('Update', 'Settings', tab + ' settings saved')
        toast('Settings saved')
    }
    const tabs = ['General', 'Email & SMTP', 'Security', 'Retention', 'Roles']
    return (
        <>
            <PageHeader
                title="Settings"
                sub="Platform-wide defaults for scheduling, delivery, security and retention."
                actions={
                    <>
                        <Btn
                            onClick={() => {
                                setS(store.settings)
                                toast('Changes discarded')
                            }}
                        >
                            Discard
                        </Btn>
                        <Btn variant="primary" onClick={save}>
                            Save changes
                        </Btn>
                    </>
                }
            />
            <section className={C.card + ' overflow-hidden'}>
                <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/60 px-2 pt-2">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            aria-current={tab === t ? 'page' : undefined}
                            className={
                                'shrink-0 rounded-t-lg border-b-2 px-4 py-3 text-[13.5px] font-medium ' +
                                (tab === t
                                    ? 'border-blue-600 bg-white text-blue-700'
                                    : 'border-transparent text-slate-600 hover:text-slate-900')
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="p-4 sm:p-5">
                    {tab === 'General' && (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Field label="Organisation name">
                                <input
                                    type="text"
                                    value={s.org}
                                    onChange={(e) => u('org', e.target.value)}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Default timezone">
                                <select className={C.input} value={s.tz} onChange={(e) => u('tz', e.target.value)}>
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
                            <Field label="Date format">
                                <select
                                    className={C.input}
                                    value={s.dateFormat}
                                    onChange={(e) => u('dateFormat', e.target.value)}
                                >
                                    {['MMM dd, yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd'].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Default query timeout (s)">
                                <input
                                    type="number"
                                    value={s.timeout}
                                    onChange={(e) => u('timeout', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Max concurrent jobs">
                                <input
                                    type="number"
                                    value={s.concurrency}
                                    onChange={(e) => u('concurrency', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Row limit per report">
                                <select
                                    className={C.input}
                                    value={s.rowLimit}
                                    onChange={(e) => u('rowLimit', e.target.value)}
                                >
                                    {['50,000', '100,000', '250,000'].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    )}
                    {tab === 'Email & SMTP' && (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Field label="SMTP host">
                                <input
                                    type="text"
                                    value={s.smtpHost}
                                    onChange={(e) => u('smtpHost', e.target.value)}
                                    className={C.input + ' font-mono text-[13px]'}
                                />
                            </Field>
                            <Field label="SMTP port">
                                <input
                                    type="number"
                                    value={s.smtpPort}
                                    onChange={(e) => u('smtpPort', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Encryption">
                                <select
                                    className={C.input}
                                    value={s.smtpTls}
                                    onChange={(e) => u('smtpTls', e.target.value)}
                                >
                                    {['STARTTLS', 'SSL/TLS', 'None'].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="From name">
                                <input
                                    type="text"
                                    value={s.fromName}
                                    onChange={(e) => u('fromName', e.target.value)}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="From address">
                                <input
                                    type="email"
                                    value={s.fromEmail}
                                    onChange={(e) => u('fromEmail', e.target.value)}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Max attachment size (MB)">
                                <input
                                    type="number"
                                    value={s.maxAttachment}
                                    onChange={(e) => u('maxAttachment', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <div className="sm:col-span-2 xl:col-span-3">
                                <Btn icon={Send} onClick={() => toast('Test email sent to john.doe@company.com')}>
                                    Send test email
                                </Btn>
                            </div>
                        </div>
                    )}
                    {tab === 'Security' && (
                        <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Check checked={s.readOnlyOnly} onChange={() => u('readOnlyOnly', !s.readOnlyOnly)}>
                                    Allow read-only SELECT queries only
                                </Check>
                                <Check checked={s.blockWrites} onChange={() => u('blockWrites', !s.blockWrites)}>
                                    Block DELETE / DROP / TRUNCATE / ALTER / UPDATE / INSERT
                                </Check>
                                <Check checked={s.requireSsl} onChange={() => u('requireSsl', !s.requireSsl)}>
                                    Require SSL/TLS on every connection
                                </Check>
                                <Check checked={s.encryptCreds} onChange={() => u('encryptCreds', !s.encryptCreds)}>
                                    Encrypt stored credentials at rest
                                </Check>
                                <Check
                                    checked={s.passwordProtect}
                                    onChange={() => u('passwordProtect', !s.passwordProtect)}
                                >
                                    Allow password-protected attachments
                                </Check>
                                <Check checked={s.approval} onChange={() => u('approval', !s.approval)}>
                                    Require approval before a new report activates
                                </Check>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">
                                Blocked statements are recorded in the audit log with the user, the query and the
                                timestamp. Administrators can grant a per-connection exception.
                            </div>
                        </div>
                    )}
                    {tab === 'Retention' && (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Field label="Execution history retention (days)">
                                <input
                                    type="number"
                                    value={s.retentionDays}
                                    onChange={(e) => u('retentionDays', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Generated file retention (days)">
                                <input
                                    type="number"
                                    value={s.fileRetention}
                                    onChange={(e) => u('fileRetention', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Audit log retention (months)">
                                <input
                                    type="number"
                                    value={s.auditRetention}
                                    onChange={(e) => u('auditRetention', Number(e.target.value))}
                                    className={C.input}
                                />
                            </Field>
                            <div className="sm:col-span-2 xl:col-span-3 space-y-2.5">
                                <Check checked={s.compress} onChange={() => u('compress', !s.compress)}>
                                    Compress attachments over the size limit instead of skipping them
                                </Check>
                                <Check checked={s.archive} onChange={() => u('archive', !s.archive)}>
                                    Archive expired files to SFTP before deletion
                                </Check>
                            </div>
                        </div>
                    )}
                    {tab === 'Roles' && (
                        <DataTable
                            minWidth={700}
                            rows={[
                                {
                                    id: 1,
                                    role: 'Administrator',
                                    people: 3,
                                    perms: 'Everything, including connections, overrides and retention',
                                },
                                {
                                    id: 2,
                                    role: 'Report Creator',
                                    people: 11,
                                    perms: 'Create, edit and run own reports; read-only SQL',
                                },
                                {
                                    id: 3,
                                    role: 'Report Viewer',
                                    people: 24,
                                    perms: 'View reports, history and generated files',
                                },
                            ]}
                            cols={[
                                {
                                    key: 'role',
                                    label: 'Role',
                                    primary: true,
                                    cell: (r) => (
                                        <span className="text-[14px] font-semibold text-slate-800">{r.role}</span>
                                    ),
                                },
                                {
                                    key: 'people',
                                    label: 'People',
                                    cell: (r) => r.people,
                                },
                                {
                                    key: 'perms',
                                    label: 'Permissions',
                                    cell: (r) => r.perms,
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    cell: () => (
                                        <div className="flex gap-1.5">
                                            <IconBtn
                                                title="Edit role"
                                                tone="text-blue-600"
                                                onClick={() => toast('Role editor opened')}
                                            >
                                                <Pencil size={15} />
                                            </IconBtn>
                                            <IconBtn
                                                title="Manage members"
                                                onClick={() => toast('Members list opened')}
                                            >
                                                <Users size={15} />
                                            </IconBtn>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    )}
                </div>
            </section>
        </>
    )
}
