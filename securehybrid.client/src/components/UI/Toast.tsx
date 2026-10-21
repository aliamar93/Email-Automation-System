import { CheckIcon } from 'lucide-react'

interface ToastProps {
    message: string | null
}


// Neeche beech mein chhota sa confirmation message
export function Toast({ message }: ToastProps) {
    return (
        <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 px-4">
            {message && (
                <div className="flex items-center gap-2.5 rounded-lg bg-slate-900 px-4 py-3 text-[13.5px] font-medium text-white shadow-xl">
                    <CheckIcon size={16} />
                    {message}
                </div>
            )}
        </div>
    )
}