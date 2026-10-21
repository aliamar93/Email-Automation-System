import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CircleCheck, Download } from 'lucide-react'
import { Btn } from './Btn'
import { Modal } from './Modal'
import { RUN_STEPS } from '../../lib/runSteps'
import type { LogLine, Report } from '../../types'

interface RunModalProps {
    report: Report
    test?: boolean
    onClose: () => void
    onFinish: () => void
}

// "Run Now" / "Run Test": steps ek ek karke chalte hain, live log ke saath
export function RunModal({ report, test, onClose, onFinish }: RunModalProps) {
    const [step, setStep] = useState(0)
    const [log, setLog] = useState<LogLine[]>([['00:00:00', 'INFO', 'Job Started - ' + report.title]])
    const [done, setDone] = useState(false)

    // onFinish ka taza version ref mein, taake timers purana function na chalayein
    const finishRef = useRef(onFinish)
    useEffect(() => {
        finishRef.current = onFinish
    }, [onFinish])

    useEffect(() => {
        let t = 0
        const timers: ReturnType<typeof setTimeout>[] = []
        const push = (msg: string) =>
            setLog((l) => l.concat([[new Date(t * 1000).toISOString().slice(11, 19), 'INFO', msg]]))
        RUN_STEPS.forEach(([label, ms], idx) => {
            t += ms / 1000
            timers.push(
                setTimeout(
                    () => {
                        setStep(idx + 1)
                        push(label + ' - done')
                        if (idx === 1) push('Query completed - 2,430 records')
                        if (idx === RUN_STEPS.length - 1) {
                            push('job completed successfully')
                            setDone(true)
                            finishRef.current()
                        }
                    },
                    RUN_STEPS.slice(0, idx + 1).reduce((a, s) => a + s[1], 0),
                ),
            )
        })
        return () => timers.forEach(clearTimeout)
    }, [])


    const pct = Math.round((step / RUN_STEPS.length) * 100)
    return (
        <Modal open={true}
            size="md"
            onClose={onClose}
            title={(test ? 'Run Test - ' : 'Run Now - ') + report.title}
            sub={test ? 'A test run emails you only and is not written to the schedule history.'
                : 'Manual execution triggered by John Doe.'}
            footer={<>

                <Btn onClick={onClose}>Close</Btn>
                <Btn variant="primary" icon={Download} disabled={!done} onClick={onClose}>
                    Download output
                </Btn>
            </>
            }>

            <div className="space-y-4">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: pct + '%' }} />
                </div>
                <ul className="space-y-2">
                    {RUN_STEPS.map(([label], i) => {
                        const state = i < step ? 'done' : i === step ? 'busy' : 'idle'
                        return (
                            <li key={label} className="flex items-center gap-3 text-[13.5px]">
                                <span className={'grid h-6 w-6 place-items-center rounded-full ' + (state === 'done' ? 'bg-emerald-50 text-emerald-600' : state === 'busy'
                                    ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400')}>

                                    {status === 'done' ? (
                                        <CheckIcon size={13} />
                                    ) : state === 'done' ? (
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                                    )}
                                </span>
                                <span className={state === 'idle' ? 'text-slate-400' : 'font-medium text-slate-700'}>
                                    {label}
                                </span>
                                {state === 'done' && <span className="ml-auto text-[12px] text-emerald-600">ok</span>}
                            </li>
                        )
                    })}
                </ul>
                <div className="overflow-x-auto rounded-lg bg-slate-900 p-3">
                    <pre className="font-mono text-[12px] leading-relaxed text-slate-100">
                        {log.map(([t, lvl, msg], i) => (
                            <div key={i} className="whitespace-pre">
                                <span className="text-slate-400">{t}</span>
                                <span className="px-2 text-emerald-400">[{lvl}]</span>
                                {msg}
                            </div>
                        ))}
                    </pre>
                </div>
                {done && (
                    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <span className="mt-0.5">
                            <CircleCheck size={18} />
                        </span>
                        <div className="text-[13px] text-emerald-800">
                            <p className="font-bold">
                                Completed in 00:00:05
                            </p>
                            <p>
                                2,430 records . 2 files . emil sent  to {' '}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}