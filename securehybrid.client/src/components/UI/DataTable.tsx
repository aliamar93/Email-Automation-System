import type { Key, ReactNode } from 'react'
import { Empty } from './Empty'
import { C } from '../../lib/styles'

// Table ka ek column: header + har row ka cell
export interface Column<T> {
    key: string
    label: ReactNode
    align?: 'left' | 'right'
    width?: number | string
    cell: (row: T) => ReactNode
    primary?: boolean
    mobile?: boolean
}

interface DataTableProps<T> {
    cols: Column<T>[]
    rows: T[]
    rowKey?: (row: T) => Key
    minWidth?: number
    empty?: ReactNode
    onRowClick?: (row: T) => void
}

const byId = <T,>(r: T) => (r as { id: Key }).id

// Bari screen par table, mobile par cards
export function DataTable<T>({ cols, rows, rowKey = byId, minWidth = 1100, empty, onRowClick }: DataTableProps<T>) {
    if (!rows.length) return empty || <Empty title="Nothing to show" text="Adjust the filters to see more results" />
    return (
        <>
            <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse" style={{ minWidth }}>
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            {cols.map((c) => (
                                <th key={c.key}
                                    className={C.th + (c.align === 'right' ? ' text-right' : '')}
                                    style={c.width ? { width: c.width } : undefined}>
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={rowKey(r)}
                                onClick={onRowClick ? () => onRowClick(r) : undefined}
                                className={
                                    'border-b border-slate-100 last:border-0 hover:bg-slate-50/70 ' + (onRowClick ? 'cursor-pointer' : '')
                                }>
                                {cols.map((c) => (
                                    <td key={c.key} className={C.td + (c.align === 'right' ? ' text-right' : '')}>
                                        {c.cell(r)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="divide-y divide-slate-100 lg:hidden">
                {rows.map((r) => (
                    <article key={rowKey(r)} className="p-4">
                        {cols
                            .filter((c) => c.primary)
                            .map((c) => (
                                <div key={c.key} className="mb-2">
                                    {c.cell(r)}
                                </div>
                            ))}
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
                            {cols
                                .filter((c) => !c.primary && c.key !== 'actions' && c.mobile !== false)
                                .map((c) => (
                                    <div key={c.key}>
                                        <dt className="text-slate-500">{c.label}</dt>
                                        <dd className="mt-0.5 font-medium tex-slate-800">{c.cell(r)}</dd>
                                    </div>
                                ))}
                        </dl>
                        {cols.filter((c) => c.key === 'actions')
                            .map((c) => (
                                <div key={c.key} className="mt-4 flex justify-end">
                                    {c.cell(r)}
                                </div>
                            ))}
                    </article>
                ))}
            </div>
        </>
    )
}