import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ConfirmState, Report, RunState, SearchResult, Store } from '../types'


// Toast mein kya likha hai (k = har naye toast ki alag key)
export interface ToastMsg {
    m: string
    k: number
}

// Context mein jo kuch pages ko milta hai
export interface AppStoreValue {
    store: Store
    setStore: Dispatch<SetStateAction<Store>>
    toast: (m: string) => void
    audit: (action: string, entity: string, details: string) => void
    confirm: (state: ConfirmState) => void
    runReport: (report: Report, test?: boolean) => void
    search: string
    setSearch: (q: string) => void
    results: SearchResult[]
    markAllRead: () => void
    readOne: (id: number) => void
    // Global overlays (AppLayout inhein dikhata hai)
    toastMsg: ToastMsg | null
    confirmState: ConfirmState | null
    closeConfirm: () => void
    running: RunState | null
    closeRun: () => void
    finishRun: () => void

}

export const AppStoreContext = createContext<AppStoreValue | null>(null)