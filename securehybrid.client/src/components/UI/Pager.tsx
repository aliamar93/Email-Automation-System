import { ChevronLeft, ChevronRight } from 'lucide-react'


interface PagerProps {
    page: number
    setPage: (page: number) => void
    total: number
    perPage: number
    setPerPage: (n: number) => void
}


// Table ke neeche page numbers aur "per page"
export function Pager({ page, setPage, total, perPage, setPerPage }: PagerProps) {
    const pages = Math.max(1, Math.ceil(total / perPage))
    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[13.5px] text-slate-600">
                Showing {total ? (page - 1) * perPage + 1 : 0}to {Math.min(page * perPage, total)} of {total}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <nav aria-label="Pagination" className="flex items-center gap-1.5">
                    <button type="button" aria-label="Previous Page"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40">
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1)
                        .slice(0, 5)
                        .map((n) => (
                            <button key={n}
                                type="button"
                                onClick={() => setPage(n)}
                                aria-current={page === n ? 'page' : undefined}
                                className={
                                    'h-9 w-9 rounded-lg text-[14px] font-medium ' +
                                    (page === n ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50')
                                }
                            >
                                {n}
                            </button>
                        ))}
                    <button type="button" aria-label="Next Page" disabled={page >= pages} onClick={() => setPage(page + 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40">
                        <ChevronRight size={16} />
                    </button>
                </nav>
                <label>
                    <span className="sr-only">Rows per page</span>
                    <select value={perPage} onChange={(e) => {
                        setPerPage(Number(e.target.value))
                        setPage(1)
                    }}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[13.5px] text-slate-700">
                        {[5, 8, 10, 25].map((n) => (
                            <option key={n} value={n}>
                                {n } per page
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    )
}