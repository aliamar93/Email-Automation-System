interface ToggleProps {
    on: boolean
    onChange: () => void
    label?: string
}


export function Toggle({ on, onChange, label }: ToggleProps) {
    return (
        <button type="button"
            role="switch"
            aria-checked={!!on}
            aria-label={label}
            onClick={onChange}
            className={
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ' +
                (on ? 'bg-blue-600' : 'bg-slate-300')
            }
        >
            <span className={'inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform ' +
                (on ? 'translate-x-[23px]' : 'translate-x-[3px]')}
            />
        </button>
    )
}