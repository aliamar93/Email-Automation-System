import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'


// Ek scheduled report ki poori shape (seed data se li gayi)
export interface Report {
    id: number
    title: string
    description: string
    recipient: string
    db: string
    sql: string
    timeout: number
    formats: string[]
    to: string[]
    cc: string[]
    bcc: string[]
    subject: string
    body: string
    type: string
    detail: string
    scheduleType: string
    runTime: string
    tz: string
    startDate: string
    endDate: string
    days: string[]
    retry: boolean
    retries: number
    retryInterval: number
    notifyAdmin: boolean
    adminEmail: string
    fileName: string
    owner: string
    createdBy: string
    createdAt: string
    modifiedBy: string
    modifiedAt: string
    last: string[]
    next: string[]
    status: string
    active: boolean
}

// Ek run (scheduled, manual ya retry) ka record
export interface Execution {
    id: string
    reportId: number
    report: string
    started: string
    finished: string
    dur: string
    rows: string
    files: string
    email: string
    status: string
    trigger: string
    by: string
}


// Database connection (password sirf form mein hota hai)
export interface Connection {
    id: number
    name: string
    engine: string
    host: string
    port: number
    database: string
    user: string
    password?: string
    ssl: boolean
    readOnly: boolean
    status: string
    lastTested: string
    reports: string
}


export interface EmailTemplate {
    id: number
    name: string
    subject: string
    category: string
    updated: string
    body: string
}

export interface ReportTemplate {
    id: number
    name: string
    category: string
    description: string
    formats: string[]
    sql: string
    uses: number
}

export interface AuditEntry {
    id: number
    time: string
    user: string
    action: string
    entity: string
    details: string
    ip: string

}


export type NotificationKind = 'error' | 'warn' | 'ok'

export interface AppNotification {
    id: number
    kind: NotificationKind
    title: string
    text: string
    time: string
    read: boolean
}


export interface Settings {
    org: string
    tz: string
    dateFormat: string
    timeout: number
    concurrency: number
    rowLimit: string
    smtpHost: string
    smtpPort: number
    smtpTls: string
    fromName: string
    fromEmail: string
    maxAttachment: number
    readOnlyOnly: boolean
    blockWrites: boolean
    requireSsl: boolean
    encryptCreds: boolean
    passwordProtect: boolean
    approval: boolean
    retentionDays: number
    fileRetention: number
    auditRetention: number
    compress: boolean
    archive: boolean
}

// Poori app ka data ek jagah
export interface Store {
    reports: Report[]
    executions: Execution[]
    connections: Connection[]
    emailTemplates: EmailTemplate[]
    reportTemplates: ReportTemplate[]
    audit: AuditEntry[]
    notifications: AppNotification[]
    settings: Settings
}

// Log ki ek line: [time, level, message]
export type LogLine = [string, string, string]

// Confirm dialog ko kya dikhana hai
export interface ConfirmState {
    title: string
    sub?: string
    body: string
    danger?: boolean
    confirmLabel?: string
    onConfirm: () => void
}

// Icon ke saath ek chhota label (connector strip, roadmap)
export interface IconTone {
    name?: string
    label?: string
    icon: LucideIcon
    tone: string
}

// Global search ka ek result
export interface SearchResult {
    kind: string
    id: number | string
    title: string
    meta: string
    icon: LucideIcon
    opne: () => void
}

// Run modal kis report ke liye khula hai
export interface RunState {
    report: Report
    test?: boolean
}