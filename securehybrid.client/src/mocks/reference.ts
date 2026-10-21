import {
    BadgeCheck,
    CalendarClock,
    ChartColumn,
    Cloud,
    Code,
    Database,
    Folder,
    Link,
    Lock,
    MessageSquare,
    ShieldCheck,
    SlidersHorizontal,
    Upload,
    Users,
} from 'lucide-react'
import type { IconTone } from '../types'

// Top bar mein supported databases ki patti (sirf bari screen par)
export const CONNECTOR_STRIP: IconTone[] = [
    {
        name: 'SQL Server',
        icon: Database,
        tone: 'text-red-500 bg-red-50',
    },
    {
        name: 'PostgreSQL',
        icon: Database,
        tone: 'text-sky-600 bg-sky-50',
    },
    {
        name: 'Oracle',
        icon: Database,
        tone: 'text-rose-600 bg-rose-50',
    },
    {
        name: 'Azure SQL',
        icon: Cloud,
        tone: 'text-blue-600 bg-blue-50',
    },
    {
        name: 'Microsoft Fabric',
        icon: ChartColumn,
        tone: 'text-teal-600 bg-teal-50',
    },
    {
        name: 'Power BI',
        icon: ChartColumn,
        tone: 'text-amber-500 bg-amber-50',
    },
    {
        name: 'SharePoint',
        icon: Folder,
        tone: 'text-emerald-600 bg-emerald-50',
    },
    {
        name: 'Teams',
        icon: MessageSquare,
        tone: 'text-violet-600 bg-violet-50',
    },
    {
        name: 'Slack',
        icon: MessageSquare,
        tone: 'text-fuchsia-600 bg-fuchsia-50',
    },
    {
        name: 'SFTP',
        icon: Upload,
        tone: 'text-indigo-600 bg-indigo-50',
    },
    {
        name: 'REST APIs',
        icon: Code,
        tone: 'text-slate-600 bg-slate-100',
    },
    {
        name: 'Webhooks',
        icon: Link,
        tone: 'text-orange-500 bg-orange-50',
    },
]

// SQL preview table ke sample columns/rows
export const PREVIEW_COLS: string[] = [
    'OrderID',
    'OrderDate',
    'CustomerName',
    'WarehouseID',
    'Status',
    'TotalAmount',
    'ProductName',
    'Category',
]

export const PREVIEW_ROWS: string[][] = [
    ['SO-10001', '2025-04-27', 'Acme Logistics', 'WH1', 'Completed', '12,450.00', 'Widget A', 'Electronics'],
    ['SO-10002', '2025-04-27', 'Global Mart', 'WH1', 'Pending', '8,230.50', 'Widget B', 'Electronics'],
    ['SO-10003', '2025-04-26', 'Retail Hub', 'WH2', 'Completed', '4,125.00', 'Widget C', 'Home & Garden'],
    ['SO-10004', '2025-04-26', 'Metro Supplies', 'WH2', 'Completed', '22,010.75', 'Gadget Pro', 'Electronics'],
    ['SO-10005', '2025-04-25', 'Prime Stores', 'WH1', 'Processing', '9,880.00', 'Widget D', 'Home & Garden'],
]

// Email mein use hone wale variables: [variable, matlab]
export const VARIABLES: [string, string][] = [
    ['{{Date}}', 'Report date (e.g. Apr 27, 2025)'],
    ['{{Time}}', 'Generation time (e.g. 09:00 AM)'],
    ['{{ReportTitle}}', 'Report title'],
    ['{{RowCount}}', 'Total number of rows'],
    ['{{FileName}}', 'Generated file name'],
]

export const FAILURE_REASONS: string[] = [
    'Database connection failed',
    'Email delivery failure',
    'SQL query error',
    'Excel generation failure',
    'Query timeout',
    'Attachment too large',
    'Empty result set (if required)',
    'Insufficient permissions',
]

export const ROADMAP: IconTone[] = [
    {
        label: 'Approval Workflow',
        icon: BadgeCheck,
        tone: 'text-emerald-600',
    },
    {
        label: 'Advanced Scheduling',
        icon: CalendarClock,
        tone: 'text-blue-600',
    },
    {
        label: 'API Access',
        icon: Code,
        tone: 'text-slate-600',
    },
    {
        label: 'Webhooks',
        icon: Link,
        tone: 'text-orange-500',
    },
    {
        label: 'Retention Policies',
        icon: ShieldCheck,
        tone: 'text-sky-600',
    },
    {
        label: 'Password Protection',
        icon: Lock,
        tone: 'text-violet-600',
    },
    {
        label: 'Multi-format Delivery',
        icon: SlidersHorizontal,
        tone: 'text-indigo-600',
    },
    {
        label: 'Role-based Permissions',
        icon: Users,
        tone: 'text-teal-600',
    },
]

export const WEEK: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
