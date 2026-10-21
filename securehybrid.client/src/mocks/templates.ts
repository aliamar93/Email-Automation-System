import { DEFAULT_SQL } from './reports'
import type { EmailTemplate, ReportTemplate } from '../types'

// Email templates aur report templates ka shuruati data
export const SEED_EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 1,
        name: 'Standard Report Delivery',
        subject: '{{ReportTitle}} - {{Date}}',
        category: 'Delivery',
        updated: 'Apr 12, 2025',
        body: 'Hi Team,\nPlease find attached the {{ReportTitle}} for {{Date}}.\nTotal Records: {{RowCount}}\nRegards,\nIT Operations Team',
    },
    {
        id: 2,
        name: 'Failure Notification',
        subject: '[FAILED] {{ReportTitle}} - {{Date}}',
        category: 'Alert',
        updated: 'Apr 02, 2025',
        body: 'The scheduled report {{ReportTitle}} failed at {{Time}}.\nReason: {{ErrorMessage}}\nRetries attempted: {{RetryCount}}\nIT Operations',
    },
    {
        id: 3,
        name: 'Empty Result Notice',
        subject: '{{ReportTitle}} - no records for {{Date}}',
        category: 'Delivery',
        updated: 'Mar 28, 2025',
        body: 'The report {{ReportTitle}} ran successfully but returned no rows for {{Date}}.\nNo attachment has been included.',
    },
    {
        id: 4,
        name: 'Executive Summary',
        subject: 'Weekly summary - {{Date}}',
        category: 'Digest',
        updated: 'Mar 19, 2025',
        body: 'Good morning,\nAttached is the weekly summary covering {{Date}}.\nHighlights are in the first sheet.\nRegards,\nReporting Automation',
    },
]

export const SEED_REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: 1,
        name: 'Warehouse Orders',
        category: 'Operations',
        description: 'Open orders by warehouse with customer and value.',
        formats: ['Excel', 'PDF'],
        sql: DEFAULT_SQL,
        uses: 12,
    },
    {
        id: 2,
        name: 'Stock On Hand',
        category: 'Inventory',
        description: 'Current stock per SKU and location with reorder flag.',
        formats: ['Excel'],
        sql: 'SELECT s.SKU, s.LocationCode, s.QtyOnHand, s.ReorderPoint\nFROM dbo.StockOnHand s\nWHERE s.QtyOnHand <= s.ReorderPoint\nORDER BY s.QtyOnHand ASC',
        uses: 9,
    },
    {
        id: 3,
        name: 'Invoice Ageing',
        category: 'Finance',
        description: 'Receivables bucketed 0-30, 31-60, 61-90, 90+.',
        formats: ['PDF'],
        sql: 'SELECT i.CustomerName, i.InvoiceNo, i.DueDate, i.Amount,\n  DATEDIFF(day, i.DueDate, GETDATE()) AS DaysOverdue\nFROM dbo.Invoices i\nWHERE i.Paid = 0\nORDER BY DaysOverdue DESC',
        uses: 6,
    },
    {
        id: 4,
        name: 'Carrier Performance',
        category: 'Logistics',
        description: 'On-time delivery rate per carrier and lane.',
        formats: ['Excel', 'PDF'],
        sql: 'SELECT c.CarrierName, COUNT(*) AS Shipments,\n  SUM(CASE WHEN s.DeliveredOn <= s.PromisedOn THEN 1 ELSE 0 END) AS OnTime\nFROM dbo.Shipments s\nJOIN dbo.Carriers c ON c.CarrierID = s.CarrierID\nGROUP BY c.CarrierName',
        uses: 4,
    },
]
