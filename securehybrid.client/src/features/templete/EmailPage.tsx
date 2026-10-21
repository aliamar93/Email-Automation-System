import { useState } from 'react'
import { Copy, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { DataTable } from '../../components/UI/DataTable'
import { Field } from '../../components/UI/Field'
import { IconBtn } from '../../components/UI/IconBtn'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { C } from '../../lib/styles'
import { VARIABLES } from '../../mocks/reference'
import { useAppStore } from '../../hooks/useAppStore'
import type { EmailTemplate } from '../../types'

// Dobara use hone wale email subject/body, wahi variables jo scheduler bharta hai
export function EmailPage() {
    const { store, setStore, toast, confirm, audit } = useAppStore()
    const [edit, setEdit] = useState<EmailTemplate | null>(null)
    const blank: EmailTemplate = {
        id: 0,
        name: '',
        category: 'Delivery',
        subject: '',
        body: '',
        updated: 'Just now',
    }
    // Template save: naya ho to add, purana ho to update
    const save = () => {
        if (!edit) return
        if (!edit.name.trim()) {
            toast('Template name is required')
            return
        }
        if (edit.id) {
            setStore((s) => ({
                ...s,
                emailTemplates: s.emailTemplates.map((t) =>
                    t.id === edit.id
                        ? {
                            ...edit,
                            updated: 'Just now',
                        }
                        : t,
                ),
            }))
            audit('Update', 'Email template #' + edit.id, 'Template “' + edit.name + '” updated')
            toast('Template updated')
        } else {
            const id = Math.max(0, ...store.emailTemplates.map((t) => t.id)) + 1
            setStore((s) => ({
                ...s,
                emailTemplates: s.emailTemplates.concat([
                    {
                        ...edit,
                        id,
                    },
                ]),
            }))
            audit('Create', 'Email template #' + id, 'Template “' + edit.name + '” created')
            toast('Template created')
        }
        setEdit(null)
    }
    return (
        <>
            <PageHeader
                title="Email Templates"
                sub="Reusable subject lines and bodies with the same variables the scheduler resolves at run time."
                actions={
                    <Btn variant="primary" icon={Plus} onClick={() => setEdit({ ...blank })}>
                        New Template
                    </Btn>
                }
            />
            <section className={C.card + ' overflow-hidden'}>
                <DataTable
                    minWidth={900}
                    rows={store.emailTemplates}
                    cols={[
                        {
                            key: 'name',
                            label: 'Template',
                            primary: true,
                            cell: (t) => <span className="text-[14px] font-semibold text-slate-800">{t.name}</span>,
                        },
                        {
                            key: 'category',
                            label: 'Category',
                            cell: (t) => <span className={C.chip + ' bg-slate-100 text-slate-600'}>{t.category}</span>,
                        },
                        {
                            key: 'subject',
                            label: 'Subject',
                            cell: (t) => <span className="font-mono text-[12.5px] text-slate-600">{t.subject}</span>,
                        },
                        {
                            key: 'updated',
                            label: 'Last updated',
                            cell: (t) => t.updated,
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            cell: (t) => (
                                <div className="flex gap-1.5">
                                    <IconBtn title="Edit" tone="text-blue-600" onClick={() => setEdit({ ...t })}>
                                        <Pencil size={15} />
                                    </IconBtn>
                                    <IconBtn
                                        title="Duplicate"
                                        onClick={() => {
                                            const id = Math.max(0, ...store.emailTemplates.map((x) => x.id)) + 1
                                            setStore((s) => ({
                                                ...s,
                                                emailTemplates: s.emailTemplates.concat([
                                                    {
                                                        ...t,
                                                        id,
                                                        name: t.name + ' (copy)',
                                                    },
                                                ]),
                                            }))
                                            toast('Template duplicated')
                                        }}
                                    >
                                        <Copy size={15} />
                                    </IconBtn>
                                    <IconBtn
                                        title="Send test"
                                        tone="text-emerald-600"
                                        onClick={() => toast('Test email sent to john.doe@company.com')}
                                    >
                                        <Send size={15} />
                                    </IconBtn>
                                    <IconBtn
                                        title="Delete"
                                        tone="text-red-500"
                                        onClick={() =>
                                            confirm({
                                                title: 'Delete “' + t.name + '”?',
                                                danger: true,
                                                confirmLabel: 'Delete template',
                                                body: 'Reports already using this template keep their current subject and body.',
                                                onConfirm: () => {
                                                    setStore((s) => ({
                                                        ...s,
                                                        emailTemplates: s.emailTemplates.filter((x) => x.id !== t.id),
                                                    }))
                                                    audit('Delete', 'Email template #' + t.id, 'Template deleted')
                                                    toast('Template deleted')
                                                },
                                            })
                                        }
                                    >
                                        <Trash2 size={15} />
                                    </IconBtn>
                                </div>
                            ),
                        },
                    ]}
                />
            </section>
            <Modal
                open={!!edit}
                size="lg"
                onClose={() => setEdit(null)}
                title={edit && edit.id ? 'Edit email template' : 'New email template'}
                footer={
                    <>
                        <Btn onClick={() => setEdit(null)}>Cancel</Btn>
                        <Btn icon={Send} onClick={() => toast('Test email sent')}>
                            Send test
                        </Btn>
                        <Btn variant="primary" onClick={save}>
                            Save template
                        </Btn>
                    </>
                }
            >
                {edit && (
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_auto]">
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Template name" required={true}>
                                    <input
                                        type="text"
                                        value={edit.name}
                                        onChange={(e) =>
                                            setEdit({
                                                ...edit,
                                                name: e.target.value,
                                            })
                                        }
                                        className={C.input}
                                    />
                                </Field>
                                <Field label="Category">
                                    <select
                                        className={C.input}
                                        value={edit.category}
                                        onChange={(e) =>
                                            setEdit({
                                                ...edit,
                                                category: e.target.value,
                                            })
                                        }
                                    >
                                        {['Delivery', 'Alert', 'Digest'].map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                            <Field label="Subject" required={true}>
                                <input
                                    type="text"
                                    value={edit.subject}
                                    onChange={(e) =>
                                        setEdit({
                                            ...edit,
                                            subject: e.target.value,
                                        })
                                    }
                                    className={C.input}
                                />
                            </Field>
                            <Field label="Body" required={true}>
                                <textarea
                                    rows={9}
                                    value={edit.body}
                                    onChange={(e) =>
                                        setEdit({
                                            ...edit,
                                            body: e.target.value,
                                        })
                                    }
                                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] leading-relaxed text-slate-700 outline-hidden focus:border-blue-500"
                                />
                            </Field>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:w-[260px]">
                            <p className="text-[13px] font-bold text-slate-800">Variables</p>
                            <dl className="mt-3 space-y-2.5">
                                {VARIABLES.map(([v, desc]) => (
                                    <div key={v} className="flex items-start gap-2.5">
                                        <dt>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEdit({
                                                        ...edit,
                                                        body: edit.body + ' ' + v,
                                                    })
                                                }
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
                )}
            </Modal>
        </>
    )
}
