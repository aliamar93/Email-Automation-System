import { useState } from 'react'
import { Eye, FileText, Plus } from 'lucide-react'
import { Btn } from '../../components/UI/Btn'
import { IconBtn } from '../../components/UI/IconBtn'
import { Modal } from '../../components/UI/Modal'
import { PageHeader } from '../../components/UI/PageHeader'
import { SqlEditor } from '../../components/UI/SqlEditor'
import { C } from '../../lib/styles'
import { useNavigate } from 'react-router'
import { useAppStore } from '../../hooks/useAppStore'
import type { ReportTemplate } from '../../types'

// Khaali page ke bajaye kisi tested query se naya report shuru karo
export function ReportPage() {
    const { store } = useAppStore()
    const navigate = useNavigate()
    const [view, setView] = useState<ReportTemplate | null>(null)
    return (
        <>
            <PageHeader
                title="Report Templates"
                sub="Start a new scheduled report from a known-good query instead of a blank page."
                actions={
                    <Btn variant="primary" icon={Plus} onClick={() => navigate('/reports/new')}>
                        Blank report
                    </Btn>
                }
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {store.reportTemplates.map((t) => (
                    <div key={t.id} className={C.card + ' flex flex-col p-5'}>
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
                            <FileText size={21} />
                        </span>
                        <h3 className="mt-3 text-[15px] font-bold text-slate-900">{t.name}</h3>
                        <p className="mt-1 flex-1 text-[13px] leading-snug text-slate-500">{t.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className={C.chip + ' bg-slate-100 text-slate-600'}>{t.category}</span>
                            {t.formats.map((f) => (
                                <span key={f} className={C.chip + ' bg-blue-50 text-blue-700'}>
                                    {f}
                                </span>
                            ))}
                        </div>
                        <p className="mt-3 text-[12px] text-slate-400">Used by {t.uses} reports</p>
                        <div className="mt-4 flex gap-2">
                            <Btn
                                size="sm"
                                variant="primary"
                                onClick={() => navigate(`/reports/new?template=${t.id}`)}
                                className="flex-1"
                            >
                                Use template
                            </Btn>
                            <IconBtn title="Preview SQL" tone="text-blue-600" onClick={() => setView(t)}>
                                <Eye size={15} />
                            </IconBtn>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                open={!!view}
                size="lg"
                onClose={() => setView(null)}
                title={view ? view.name : ''}
                sub={view ? view.description : ''}
                footer={
                    <>
                        <Btn onClick={() => setView(null)}>Close</Btn>
                        <Btn
                            variant="primary"
                            icon={Plus}
                            onClick={() => {
                                const v = view
                                if (!v) return
                                setView(null)
                                navigate(`/reports/new?template=${v.id}`)
                            }}
                        >
                            Use this template
                        </Btn>
                    </>
                }
            >
                {view && <SqlEditor value={view.sql} onChange={() => { }} readOnly={true} rows={12} />}
            </Modal>
        </>
    )
}
