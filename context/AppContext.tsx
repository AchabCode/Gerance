// context/AppContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import {
  BankrollItem,
  JournalEntry,
  HourlyRateParams,
  AppState,
  BankrollHistory,
  SimulatorConfig,
} from '../types'
import {
  loadAllData,
  createBankrollItem,
  updateBankrollItem as updateBI,
  deleteBankrollItem as deleteBI,
  createJournalEntry,
  deleteJournalEntry as deleteJE,
  saveHourlyRateParams,
  addBankrollHistoryPoint,
  saveSimulatorConfig,
  deleteSimulatorConfig as deleteSC,
} from '../utils/data'
import { calculateTotalBankroll } from '../utils/calculations'
import { useAuth } from './AuthContext'

interface AppContextType extends AppState {
  addBankrollItem: (
      item: Omit<BankrollItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<void>
  updateBankrollItem: (item: BankrollItem) => Promise<void>
  deleteBankrollItem: (id: string) => Promise<void>
  addJournalEntry: (
      entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<void>
  deleteJournalEntry: (id: string) => Promise<void>
  updateHourlyRateParams: (params: HourlyRateParams) => Promise<void>
  addHistoryPoint: (amount: number, date?: string) => Promise<void>
  saveConfig: (config: Omit<SimulatorConfig, 'id'>) => Promise<void>
  deleteSimulatorConfig: (id: string) => Promise<void>
  loading: boolean
  error: string | null
}

const defaultState: AppState = {
  bankrollItems: [],
  bankrollHistory: [],
  journalEntries: [],
  hourlyRateParams: {
    bb_amount: 0,
    bb_per_hour: 0,
    rakeback_hourly: 0,
    monthly_hours: 0,
    monthly_expenses: 0,
  },
  simulatorConfigs: [],
}

const AppContext = createContext<AppContextType>({
  ...defaultState,
  addBankrollItem: async () => {},
  updateBankrollItem: async () => {},
  deleteBankrollItem: async () => {},
  addJournalEntry: async () => {},
  deleteJournalEntry: async () => {},
  updateHourlyRateParams: async () => {},
  addHistoryPoint: async () => {},
  saveConfig: async () => {},
  deleteSimulatorConfig: async () => {},
  loading: true,
  error: null,
})

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const [state, setState] = useState<AppState>(defaultState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        if (user) {
          const data = await loadAllData()
          setState(data)
        } else {
          setState(defaultState)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error')
      } finally {
        setLoading(false)
      }
    })()
  }, [user?.id])

  const addHistoryPoint = async (amount: number, date?: string) => {
    const point = await addBankrollHistoryPoint({
      date: date || new Date().toISOString(),
      amount,
    })
    setState(prev => ({
      ...prev,
      bankrollHistory: [...prev.bankrollHistory, point],
    }))
  }

  const addBankrollItem = async (
      item: Omit<BankrollItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    const saved = await createBankrollItem(item)
    setState(prev => ({
      ...prev,
      bankrollItems: [...prev.bankrollItems, saved],
    }))
    const total = calculateTotalBankroll([...state.bankrollItems, saved])
    await addHistoryPoint(total)
  }

  const updateBankrollItem = async (item: BankrollItem) => {
    const saved = await updateBI(item)
    const items = state.bankrollItems.map(i => (i.id === saved.id ? saved : i))
    setState(prev => ({ ...prev, bankrollItems: items }))
    const total = calculateTotalBankroll(items)
    await addHistoryPoint(total)
  }

  const deleteBankrollItem = async (id: string) => {
    await deleteBI(id)
    const items = state.bankrollItems.filter(i => i.id !== id)
    setState(prev => ({ ...prev, bankrollItems: items }))
    const total = calculateTotalBankroll(items)
    await addHistoryPoint(total)
  }

  const addJournalEntry = async (
      entry: Omit<
          JournalEntry,
          'id' | 'created_at' | 'updated_at' | 'user_id'
      >,
  ) => {
    const saved = await createJournalEntry(entry)
    setState(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, saved],
    }))
  }

  const deleteJournalEntry = async (id: string) => {
    await deleteJE(id)
    setState(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.filter(e => e.id !== id),
    }))
  }

  const updateHourlyRateParams = async (params: HourlyRateParams) => {
    const saved = await saveHourlyRateParams(params)
    setState(prev => ({ ...prev, hourlyRateParams: saved }))
  }

  const saveConfig = async (config: Omit<SimulatorConfig, 'id'>) => {
    const saved = await saveSimulatorConfig(config)
    setState(prev => ({
      ...prev,
      simulatorConfigs: [saved, ...prev.simulatorConfigs],
    }))
  }

  const deleteSimulatorConfig = async (id: string) => {
    await deleteSC(id)
    setState(prev => ({
      ...prev,
      simulatorConfigs: prev.simulatorConfigs.filter(c => c.id !== id),
    }))
  }

  return (
      <AppContext.Provider
          value={{
            ...state,
            addBankrollItem,
            updateBankrollItem,
            deleteBankrollItem,
            addJournalEntry,
            deleteJournalEntry,
            updateHourlyRateParams,
            addHistoryPoint,
            saveConfig,
            deleteSimulatorConfig,
            loading,
            error,
          }}
      >
        {children}
      </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}