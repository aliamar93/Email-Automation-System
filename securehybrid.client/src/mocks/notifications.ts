import type { AppNotification } from '../types'

// Bell icon wale notifications
export const SEED_NOTIFICATIONS: AppNotification[] = [
    {
        id: 1,
        kind: 'error',
        title: 'Purchase Orders failed',
        text: 'Retry 1 of 3 failed with a SQL query error.',
        time: '6 min ago',
        read: false,
    },
    {
        id: 2,
        kind: 'warn',
        title: 'Attachment too large',
        text: 'Customer Order Aging skipped the Excel attachment.',
        time: '1 h ago',
        read: false,
    },
    {
        id: 3,
        kind: 'ok',
        title: 'Daily Warehouse Orders delivered',
        text: '2,430 records sent to 4 recipients.',
        time: '2 h ago',
        read: false,
    },
    {
        id: 4,
        kind: 'ok',
        title: 'Connection restored',
        text: 'Warehouse Database responded after 2 failed checks.',
        time: 'Yesterday',
        read: true,
    },
]
