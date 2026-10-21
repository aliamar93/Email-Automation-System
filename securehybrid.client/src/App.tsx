import { LucideProvider } from 'lucide-react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { AppStoreProvider } from './context/AppStoreProvider'
import { ComingSoon } from './components/UI/ComingSoon'
import { AuditPage } from './features/audit/AuditPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { DatabaseConnection } from './features/database/DatabaseConnection'
import { ExecutionPage } from './features/execution/ExecutionPage'
import { NotFoundPage } from './features/not-found/NotFoundPage'
import { ReportDetailPage } from './features/reports/ReportDetailPage'
import { ReportFormPage } from './features/reports/ReportFormPage'
import { ReportsPage } from './features/reports/ReportsPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { EmailPage } from './features/templete/EmailPage'
import { ReportPage } from './features/templete/ReportPage'

//URL => Kaunsa page

function App() {
    return (
        <BrowserRouter>
            <AppStoreProvider>
                {/* Saare icons ki line HTML jaisi patli (1.8) */}
                <LucideProvider strokeWidth={1.8}>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="reports/new" element={<ReportFormPage />} />
                            <Route path="reports/:id" element={<ReportDetailPage />} />
                            <Route path="reports/:id/edit" element={<ReportFormPage />} />
                            <Route path="executions" element={<ExecutionPage />} />
                            <Route path="connections" element={<DatabaseConnection />} />
                            <Route path="email-templates" element={<EmailPage />} />
                            <Route path="report-templates" element={<ReportPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="audit" element={<AuditPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </LucideProvider>
            </AppStoreProvider>
        </BrowserRouter>
    )
}

export default App

// import { useState } from 'react'
// import { NAV_ITEMS } from './components/layout/navItems'
// import { Sidebar } from './components/layout/Sidebar'
// import { TopBar } from './components/layout/TopBar'


// function App() {
//     const [activePage, setActivePage] = useState('dashboard')
//     const [menuOpen, setMenuOpen] = useState(false)


//     //jab sidebar mein koi click ho
//     const handleSelect = (key: string) => {
//         setActivePage(key)
//         setMenuOpen(false)
//     }

//     //Active item ka poora data dhoondo (title dikhane ke liye)
//     const currentItem = NAV_ITEMS.find((item) => item.key === activePage)


//     return (
//         <div className="min-h-screen">
//             <TopBar OnMenuClick={() => setMenuOpen(true)} />
//             <Sidebar activePage={activePage} onSelect={handleSelect} open={menuOpen} onClose={() => setMenuOpen(false)} />

//             {/* Content area: bari screen par sidebar ki chaurai (248px) jitna left se hata hua */}
//             <div className="lg:pl-[248px]">
//                 <main className="mx-auto max-w-[1680px] space-y-5 p-4 sm:p-6">
//                     <div>
//                         <h1 className="text-[28px] font-bold text-slate-900">{currentItem?.label}</h1>
//                         <p className="mt-1 text-[14px] text-slate-500">This Page will be built in a later step.</p>
//                     </div>

//                     {/* Sample cards, sirf theme dekhne ke liye */}
//                     <div className="grid gap-4 sm:grid-cols-3">
//                         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//                             <div className="min-w-0">
//                                 <p className="text-[24px] font-bold text-slate-900">8</p>
//                                 <p className="text-[13px] text-slate-500">Total reports</p>
//                             </div>

//                         </div>
//                         <div className="rounded-xl bordder border-slate-200 bg-white p-5 shadow-sm">
//                             <p className="text-[24px] font-bold text-emerald-600">5</p>
//                             <p className="text-[13px] text-slate-500">Active reports</p>
//                         </div>
//                         <div className="rounded-xl bordder border-slate-200 bg-white p-5 shadow-sm">
//                             <p className="text-[24px] font-bold text-emerald-600">5</p>
//                             <p className="text-[13px] text-slate-500">Active reports</p>
//                         </div>
//                         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//                             <p className="text-[24px] font-bold text-red-600">3</p>
//                             <p className="text-[13px] text-slate-500">Failed (24 h)</p>
//                         </div>
//                         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//                             <p className="text-[24px] font-bold text-red-600">12</p>
//                             <p className="text-[13px] text-slate-500">Reports Sent Today</p>
//                         </div>
//                         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//                             <p className="text-[24px] font-bold text-red-600">98.5%</p>
//                             <p className="text-[13px] text-slate-500">Success Rate (7 d)</p>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }

// export default App