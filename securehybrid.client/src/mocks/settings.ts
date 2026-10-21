import type { Settings } from '../types'

// Settings page ki shuruati values
export const SEED_SETTINGS: Settings = {
    org: 'Your Company Logistics & Warehouse ERP',
    tz: '(UTC+08:00) Singapore',
    dateFormat: 'MMM dd, yyyy',
    timeout: 120,
    concurrency: 5,
    rowLimit: '50,000',
    smtpHost: 'smtp.company.com',
    smtpPort: 587,
    smtpTls: 'STARTTLS',
    fromName: 'Reporting Automation',
    fromEmail: 'reports@company.com',
    maxAttachment: 15,
    readOnlyOnly: true,
    blockWrites: true,
    requireSsl: true,
    encryptCreds: true,
    passwordProtect: false,
    approval: false,
    retentionDays: 90,
    fileRetention: 30,
    auditRetention: 24,
    compress: true,
    archive: false,
}
