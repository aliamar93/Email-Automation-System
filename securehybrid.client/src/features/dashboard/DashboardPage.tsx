import { PageHeader } from '../../components/UI/PageHeader'


export function DashboardPage() {
    return (
        <>
            <PageHeader title="Dashboard" subtitle="Every scheduled SQL report, delivery and failure in one place." />

            {/* Sample cards. Asli numbers baad mein data se aayenge. */}
            <div className="grid gap-4 sm:grid-cols-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"></path>
                            <path d="M14 3v5h5"></path>
                        </svg>
                    </span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-slate-900">8</p>
                        <p className="text-[13px] text-slate-500">Total reports</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 4l13 8-13 8V4z"></path>
                        </svg>
                    </span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-emerald-600">5</p>
                        <p className="text-[13px] text-slate-500">Active reports</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M10 9v6M14 9v6"></path></svg>
                    </span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-red-600">2</p>
                        <p className="text-[13px] text-slate-500">Disabled Reports</p>
                    </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M12 7v6M12 16.5h.01"></path></svg>
                    </span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-slate-900">3</p>
                        <p className="text-[13px] text-slate-500">Failed (24 h)</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3L3 10.5l7 3 3 7L21 3z"></path>
                            <path d="M10 13.5L21 3"></path></svg>
                    </span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-emerald-600">12</p>
                        <p className="text-[13px] text-slate-500">Reports Sent Today</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 17l6-6 4 4 7-7"></path>
                            <path d="M14 8h6v6"></path></svg></span>
                    <div className="min-w-0">
                        <p className="text-[24px] font-bold text-red-600">98.5%</p>
                        <p className="text-[13px] text-slate-500">Success Rate (7 d)</p>
                    </div>
                </div>

            </div>

            <div className="grid gap-4 xl:grid-cols-3 xl:gap-5">
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-slate-900">Executions in the last 7 days</h2>
                            <p className="mt-0.5 text-[12.5px] text-slate-500">Successful versus failed runs per day</p>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-4 text-[12px] text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-blue-500"></span>
                                    Success
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-sm bg-red-400"></span>
                                    Failed
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">
                        <div className="flex h-[220px] items-end gap-3 sm:gap-5">
                            {/* Mon */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">40</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded-t bg-red-400" title="2 failed" style={{ height: 6.12245 }}></div>
                                    <div className="w-full rounded-b bg-blue-500" title="38 successful" style={{ height: 116.327 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Mon</span>
                            </div>

                            {/* Tue */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">41</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded bg-blue-500" title="41 successful" style={{ height: 125.51 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Tue</span>
                            </div>

                            {/* Wed */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">39</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded-t bg-red-400" title="3 failed" style={{ height: 9.18367 }}></div>
                                    <div className="w-full rounded-b bg-blue-500" title="36 successful" style={{ height: 110.204 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Wed</span>
                            </div>

                            {/* Thu */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">45</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded-t bg-red-400" title="1 failed" style={{ height: 3.06122 }}></div>
                                    <div className="w-full rounded-b bg-blue-500" title="44 successful" style={{ height: 134.694 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Thu</span>
                            </div>

                            {/* Fri */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">49</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded-t bg-red-400" title="2 failed" style={{ height: 6.12245 }}></div>
                                    <div className="w-full rounded-b bg-blue-500" title="47 successful" style={{ height: 143.878 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Fri</span>
                            </div>

                            {/* Sat */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">21</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded bg-blue-500" title="21 successful" style={{ height: 64.2857 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Sat</span>
                            </div>

                            {/* Sun */}
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-[11.5px] font-semibold text-slate-600">19</span>
                                <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 150 }}>
                                    <div className="w-full rounded-t bg-red-400" title="1 failed" style={{ height: 3.06122 }}></div>
                                    <div className="w-full rounded-b bg-blue-500" title="18 successful" style={{ height: 55.102 }}></div>
                                </div>
                                <span className="text-[12px] text-slate-500">Sun</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm ">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-slate-900">System health</h2>
                            <p className="mt-0.5 text-[12.5px] text-slate-500">Checked every 60 seconds</p>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 12a9 9 0 11-3-6.7"></path>
                                    <path d="M21 4v5h-5"></path>
                                </svg>Check
                            </button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"></path>
                                    </svg>
                                </span>
                                <span className="text-[13.5px] text-slate-600">Scheduler</span>
                                <span className="ml-auto text-[13.5px] font-semibold text-emerald-600">Online</span>
                            </li>
                            <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                                        <path d="M3 7.5l9 6 9-6"></path>
                                    </svg>
                                </span>
                                <span className="text-[13.5px] text-slate-600">SMTP relay</span>
                                <span className="ml-auto text-[13.5px] font-semibold text-emerald-600">Healthy</span>
                            </li>
                            <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
                                        <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"></path>
                                        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"></path>
                                    </svg>
                                </span>
                                <span className="text-[13.5px] text-slate-600">Connections</span>
                                <span className="ml-auto text-[13.5px] font-semibold text-amber-600">3 / 4</span>
                            </li>
                            <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="4" width="18" height="7" rx="2"></rect>
                                        <rect x="3" y="13" width="18" height="7" rx="2"></rect>
                                        <path d="M7 7.5h.01M7 16.5h.01"></path>
                                    </svg>
                                </span>
                                <span className="text-[13.5px] text-slate-600">Queue depth</span>
                                <span className="ml-auto text-[13.5px] font-semibold text-slate-700">3 jobs</span>
                            </li>
                        </ul>
                        <div className="mt-4 grid grid-cols-2 gap-2.5">
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M6 4l13 8-13 8V4z"></path>
                                </svg>Run due jobs</button>
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
                                    <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"></path>
                                    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"></path>
                                </svg>Connections</button>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm ">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-slate-900">Next scheduled runs</h2>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">All reports</button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <ul className="divide-y divide-slate-100">
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7.5V12l3 1.8"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <button type="button" className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600">Daily Warehouse Orders</button>
                                    <p className="text-[12px] text-slate-500">Apr 28, 2025 · 08:00 AM</p>
                                </div>
                                <button type="button" title="Run Daily Warehouse Orders" aria-label="Run Daily Warehouse Orders" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 text-emerald-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M6 4l13 8-13 8V4z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7.5V12l3 1.8"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1"><button type="button" className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600">Inventory Stock Levels</button>
                                    <p className="text-[12px] text-slate-500">Apr 27, 2025 · 08:00 AM</p>
                                </div>
                                <button type="button" title="Run Inventory Stock Levels" aria-label="Run Inventory Stock Levels" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 text-emerald-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M6 4l13 8-13 8V4z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7.5V12l3 1.8"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <button type="button" className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600">Sales Summary</button>
                                    <p className="text-[12px] text-slate-500">Apr 28, 2025 · 09:00 AM</p>
                                </div>
                                <button type="button" title="Run Sales Summary" aria-label="Run Sales Summary" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 text-emerald-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M6 4l13 8-13 8V4z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7.5V12l3 1.8"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <button type="button" className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600">Aging Report</button>
                                    <p className="text-[12px] text-slate-500">May 1, 2025 · 09:00 AM</p>
                                </div>
                                <button type="button" title="Run Aging Report" aria-label="Run Aging Report" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 text-emerald-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M6 4l13 8-13 8V4z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7.5V12l3 1.8"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <button type="button" className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600">Open Invoices</button>
                                    <p className="text-[12px] text-slate-500">Apr 28, 2025 · 10:00 AM</p>
                                </div>
                                <button type="button" title="Run Open Invoices" aria-label="Run Open Invoices" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 text-emerald-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M6 4l13 8-13 8V4z"></path>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm ">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-slate-900">Recent failures</h2>
                            <p className="mt-0.5 text-[12.5px] text-slate-500">3 in the last 24 hours</p>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">History</button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <ul className="divide-y divide-slate-100">
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7v6M12 16.5h.01"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13.5px] font-semibold text-slate-800">Inventory Stock Levels</p>
                                    <p className="font-mono text-[11.5px] text-slate-500">EX-2025-0427-002 · Apr 27, 2025 05:00 AM</p>
                                </div>
                                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 12a9 9 0 11-3-6.7"></path>
                                        <path d="M21 4v5h-5"></path>
                                    </svg>Retry</button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7v6M12 16.5h.01"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13.5px] font-semibold text-slate-800">Purchase Orders</p>
                                    <p className="font-mono text-[11.5px] text-slate-500">EX-2025-0427-011 · Apr 27, 2025 06:00 AM</p>
                                </div>
                                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 12a9 9 0 11-3-6.7"></path>
                                        <path d="M21 4v5h-5"></path>
                                    </svg>Retry</button>
                            </li>
                            <li className="flex items-center gap-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M12 7v6M12 16.5h.01"></path>
                                    </svg>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13.5px] font-semibold text-slate-800">Purchase Orders</p>
                                    <p className="font-mono text-[11.5px] text-slate-500">EX-2025-0427-012 · Apr 27, 2025 06:07 AM</p>
                                </div>
                                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 12a9 9 0 11-3-6.7"></path>
                                        <path d="M21 4v5h-5"></path>
                                    </svg>Retry</button>
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm ">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-slate-900">Recent activity</h2>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm h-9 px-3 text-[13px] ">Audit log</button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">System</span> · Execute · Report #102</p>
                                    <p className="truncate text-[12px] text-slate-500">Scheduled run completed - 1,245 records</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 27, 2025 08:02 AM</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">John Doe</span> · Update · Report #101</p>
                                    <p className="truncate text-[12px] text-slate-500">Recipients changed - added logistics@company.com</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 27, 2025 07:41 AM</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">System</span> · Failure · Report #103</p>
                                    <p className="truncate text-[12px] text-slate-500">Retry 1 of 3 failed - SQL query error</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 27, 2025 06:09 AM</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">Sarah Chen</span> · Create · Report #108</p>
                                    <p className="truncate text-[12px] text-slate-500">Report created and activated</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 26, 2025 05:22 PM</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">John Doe</span> · Execute · Report #101</p>
                                    <p className="truncate text-[12px] text-slate-500">Manual run triggered from report list</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 26, 2025 11:14 AM</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-700">
                                        <span className="font-semibold">A. Fischer</span> · Disable · Report #107</p>
                                    <p className="truncate text-[12px] text-slate-500">Report disabled pending query review</p>
                                    <p className="text-[11.5px] text-slate-400">Apr 25, 2025 04:50 PM</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
}