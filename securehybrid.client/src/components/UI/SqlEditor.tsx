import { useRef } from 'react'
import { highlightSql } from '../../lib/sql'
interface SqlEditorProps {
    value: string
    onChange?: (value: string) => void
    rows?: number
    readOnly?: boolean
}

// SQL editor: neeche rangeen highlight, upar transparent textarea

export function SqlEditor({ value, onChange, rows = 15, readOnly }: SqlEditorProps) {
    const preRef = useRef<HTMLPreElement>(null)
    const taRef = useRef<HTMLTextAreaElement>(null)
    const lines = value.split('\n')
    const sync = () => {
        if (preRef.current && taRef.current) {
            preRef.current.scrollTop = taRef.current.scrollTop
            preRef.current.scrollLeft = taRef.current.scrollLeft
        }
    }

    const common = 'font-mono text-[12.5px] leading-[1.6] whitespace-pre'
    return (
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
            <div className="flex">
                <div aria-hidden="true" className={'select-none border-r border-slate-700/70 bg-slate-950/40 px-2.5 py-3 text-right text-slate-500 ' + common} style={{ minWidth: 42 }}>
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>
                <div className="relative flex-1 overflow-hidden">
                    <pre ref={preRef} aria-hidden="true" className={'pointer-events-none absolute inset-0 overflow-auto px-3 py-3 text-slate-100 ' + common}
                        dangerouslySetInnerHTML={{ __html: highlightSql(value) + '\n' }} />
                    <textarea ref={taRef} value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        onScroll={sync}
                        spellCheck={false}
                        readOnly={readOnly}
                        aria-label="SQL query"
                        className={
                            'relative block w-full resize-y overflow-auto bg-transparent px-3 py-3 text-transparent caret-white outline-hidden ' + common}
                        style={{ minHeight: rows * 20 + 24 }} />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-700/70 bg-slate-950/40 px-3 py-2 font-mono text-[11px] text-slate-400">
                <span>Ln {lines.length}</span>
                <span>{value.length} chars</span>
                <span>{(value.match(/@\w+/g) || []).length} parameters</span>
                <span className="ml-auto">Editable - Select Only</span>
            </div>
        </div>
    )
}