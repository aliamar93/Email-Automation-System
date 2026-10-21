import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Confirm } from '../UI/Confirm'
import { RunModal } from '../UI/RunModal'
import { Toast } from '../UI/Toast'
import { useAppStore } from '../../hooks/useAppStore'
import { AppBar } from './AppBar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'


// Har page ke gird ek hi frame: TopBar + Sidebar + AppBar + content + global modals
export function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { pathname } = useLocation()
    const { running, closeRun, finishRun, confirmState, closeConfirm, toastMsg } = useAppStore()

    // Naye page par upar se shuru karo
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])


    return (
        <div className="min-h-screen">
            <TopBar />
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* Content area: bari screen par sidebar ki chaurai (248px) jitna left se hata hua */}
            <div className="lg:pl-[248px]">
                <AppBar onMenu={() => setMenuOpen(true)} />
                <main className="mx-auto max-w-[1680px] space-y-4 p-4 sm:space-y-5 sm:p-6">
                    <Outlet />
                </main>
            </div>

            {running && (
                <RunModal report={running.report} test={running.test} onClose={closeRun} onFinish={finishRun} />
            )}
            <Confirm state={confirmState} onClose={closeConfirm} />
            <Toast message={toastMsg ? toastMsg.m : null} />
        </div>
    )
}