import type { ConfirmState } from '../../types'
import { Btn } from './Btn'
import { Modal } from './Modal'

interface ConfirmProps {
    state: ConfirmState | null
    onClose: () => void
}

// "Pakka?" wala dialog (delete, disable wagaira se pehle)
export function Confirm({ state, onClose }: ConfirmProps) {
    if (!state) return null
    return (
        <Modal open={true} size="sm" title={state.title} sub={state.sub} onClose={onClose} footer={
            <>
                <Btn onClick={onClose}>Cancel</Btn>
                <Btn variant={state.danger ? 'danger' : 'primary'} onClick={() => {
                    state.onConfirm()
                    onClose()
                }}>
                    {state.confirmLabel || 'Confirm'}
                </Btn>
            </>
        }>
            <p className="text-[13.5px] leading-relaxed text-slate-600">{state.body}</p>
        </Modal>
    )
}