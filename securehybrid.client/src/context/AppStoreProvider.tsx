import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { CalendarClock, Database, History, Mail } from 'lucide-react'
import { AppStoreContext } from './appStoreContext'
import type { AppStoreValue, ToastMsg } from './appStoreContext'
import { SEED_AUDIT } from '../mocks/audit'
import { SEED_CONNECTIONS } from '../mocks/connections'
import { SEED_EXECUTIONS } from '../mocks/executions'
import { SEED_NOTIFICATIONS } from '../mocks/notifications'
import { SEED_REPORTS } from '../mocks/reports'
import { SEED_SETTINGS } from '../mocks/settings'
import { SEED_EMAIL_TEMPLATES, SEED_REPORT_TEMPLATES } from '../mocks/templates'
import type { ConfirmState, Report, RunState, SearchResult, Store } from '../types/index'

// Poori app ka data yahan rehta hai. Abhi sab mock data hai, baad mein api/ se aayega.
export function AppStoreProvider({ children }: { children: ReactNode }) {

    const navigate = useNavigate()

    const [store, setStore] = useState<Store>({
        reports: SEED_REPORTS,
        executions: SEED_EXECUTIONS,
        connections: SEED_CONNECTIONS,
        emailTemplates: SEED_EMAIL_TEMPLATES,
        reportTemplates: SEED_REPORT_TEMPLATES,
        audit: SEED_AUDIT,
        notifications: SEED_NOTIFICATIONS,
        settings: SEED_SETTINGS,
    })
    const [toastMsg, setToastMsg] = useState<ToastMsg | null>(null)
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
    const [running, setRunning] = useState<RunState | null>(null)
    const [search, setSearch] = useState('')

    // Neeche beech mein chhota sa message, 2.6 second baad khud gayab
    const toast = useCallback((m: string) => setToastMsg({ m, k: Date.now() }), [])
    useEffect(() => {
        if (!toastMsg) return
        const t = setTimeout(() => setToastMsg(null), 2600)
        return () => clearTimeout(t)
    }, [toastMsg])


    const audit = useCallback(
        (action: string, entity: string, details: string) =>
            setStore((s) => ({
                ...s,
                audit: [
                    {
                        id: Date.now(),
                        time: 'Apr 27,2025 02:15 PM',
                        user: 'John Doe',
                        action,
                        entity,
                        details,
                        ip: '10.4.9.63',
                    },
                ].concat(s.audit),
            })),
        [],
    )

    const runReport = useCallback((report: Report, test?: boolean) => setRunning({ report, test }), [])
    const closeRun = useCallback(() => setRunning(null), [])
    const closeConfirm = useCallback(() => setConfirmState(null), [])

    // Run modal poora hone par: test run ho to kuch save nahi hota
    const finishRun = useCallback(() => {
        if (!running) return
        const r = running.report
        if (!running.test) {
            setStore((s) => ({
                ...s,
                executions: [
                    {
                        id: 'EX-2025-0427-' + String(100 + s.executions.length),
                        reportId: r.id,
                        report: r.title,
                        started: 'Apr 27,2025 02:15 PM',
                        finished: 'Apr 27,2025 02:15 PM',
                        dur: '00:00:05',
                        rows: '2,430',
                        files: String(r.formats.length),
                        email: 'Sent',
                        status: 'Success',
                        trigger: 'Manual',
                        by: 'John Doe'

                    },
                ].concat(s.executions),
                reports: s.reports.map((x) =>
                    x.id === r.id ? { ...x, status: 'Success', last: ['Apr 27,2025', '02:15 PM'] } : x,
                ),
            }))
            audit('Execute', 'Report #' + r.id, 'Manual run completed - 2,430 records')
        }
    }, [running, audit])


    const markAllRead = useCallback(() => {
        setStore((s) => ({
            ...s,
            notifications: s.notifications.map((n) => ({ ...n, read: true }))
        }))
        toast('All notifications marked read')
    }, [toast])

    const readOne = useCallback(
        (id: number) =>
            setStore((s) => ({
                ...s,
                notifcations: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
            })),
        [],
    )

    // Top bar search: reports, connections, email templates aur executions mein dhoondo
    const results = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return []
        const out: SearchResult[] = []
        store.reports
            .filter((r) => r.title.toLowerCase().includes(q))
            .slice(0, 4)
            .forEach((r) =>
                out.push({
                    kind: 'r',
                    id: r.id,
                    title: r.title,
                    meta: 'Report #' + r.id + ' . ' + r.type,
                    icon: CalendarClock,
                    open: () => navigate(`/reports/${r.id}`),
                }),
            )
        store.connections
            .filter((c) => c.name.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((c) =>
                out.push({
                    kind: 'c',
                    id: c.id,
                    title: c.name,
                    meta: 'Connection .' + c.engine,
                    icon: Database,
                    open: () => navigate('/connections'),
                }),
            )
        store.emailTemplates
            .filter((t) => t.name.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((t) =>
                out.push({
                    kind: 'e',
                    id: t.id,
                    title: t.name,
                    meta: 'Email Template',
                    icon: Mail,
                    open: () => navigate('/email-templates'),
                }),
            )
        store.executions
            .filter((e) => e.id.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((e) =>
                out.push({
                    kind: 'x',
                    id: e.id,
                    title: e.id,
                    meta: 'Execution . ' + e.report,
                    icon: History,
                    open: () => navigate('/executions'),
                }),
            )
        return out
    }, [search, store, navigate])

    const value : AppStoreValue = {
        store,
        setStore,
        toast,
        audit,
        confirm: setConfirmState,
        runReport,
        search,
        setSearch,
        results,
        markAllRead,
        readOne,
        toastMsg,
        confirmState,
        closeConfirm,
        running,
        closeRun,
        finishRun,
    }

    return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

