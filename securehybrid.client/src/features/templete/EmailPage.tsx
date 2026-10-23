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
        </>
    )
}