import {
    CalendarClock,
    Database,
    FileText,
    History,
    LayoutDashboard,
    Mail,
    Settings,
    ShieldCheck,
    type LucideIcon,
} from 'lucide-react'

// Ek menu item ki shape
export interface NavItem {
    path: string
    key: string
    label: string
    icon: LucideIcon
}

// Sidebar ke saare menu items
export const NAV_ITEMS: NavItem[] = [
    { path: '/', key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reports', key: 'reports', label: 'Scheduled Reports', icon: CalendarClock },
    { path: '/executions' , key: 'executions', label: 'Execution History', icon: History },
    { path: '/connections', key: 'connections', label: 'Database Connections', icon: Database },
    { path: '/email-templates' , key: 'email-templates', label: 'Email Templates', icon: Mail },
    { path: '/report-templates' , key: 'report-templates', label: 'Report Templates', icon: FileText },
    { path: '/settings' , key: 'settings', label: 'Settings', icon: Settings },
    { path: '/audit' , key: 'audit', label: 'Audit Logs', icon: ShieldCheck }
]