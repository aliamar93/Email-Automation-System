import { useContext } from 'react'
import { AppStoreContext } from '../context/appStoreContext'


// Har page isi hook se store, toast, confirm wagaira leta hai
export function useAppStore() {
    const value = useContext(AppStoreContext)
    if (!value) throw new Error('useAppStore must be used inside <AppStoreProvider>')
    return value
}