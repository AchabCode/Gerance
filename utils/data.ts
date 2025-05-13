import { supabase } from '@/lib/supabase'
import {
  BankrollItem,
  BankrollHistory,
  JournalEntry,
  HourlyRateParams,
  AppState,
  SimulatorConfig,
} from '@/types'

const getUid = async () =>
    (await supabase.auth.getUser()).data.user?.id ?? null

const handle = <T>(ctx: string, data: T | null, error: any): T => {
  if (error) {
    if (error.status === 401) return ([] as unknown) as T
    console.error(`Error in ${ctx}:`, error)
    throw error
  }
  return (data as T) ?? ([] as unknown as T)
}

export const createBankrollItem = async (
    item: Omit<BankrollItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) => {
  const { data, error } = await supabase.from('bankroll_items').insert(item).select().single()
  return handle('createBankrollItem', data, error) as BankrollItem
}

export const updateBankrollItem = async (item: BankrollItem) => {
  const { data, error } = await supabase
      .from('bankroll_items')
      .update({ name: item.name, amount: item.amount, type: item.type })
      .eq('id', item.id)
      .select()
      .single()
  return handle('updateBankrollItem', data, error) as BankrollItem
}

export const deleteBankrollItem = async (id: string) => {
  const { error } = await supabase.from('bankroll_items').delete().eq('id', id)
  if (error) throw error
}

export const loadBankrollItems = async (): Promise<BankrollItem[]> => {
  const { data, error } = await supabase
      .from('bankroll_items')
      .select('*')
      .order('created_at', { ascending: true })
  return handle('loadBankrollItems', data, error)
}

export const addBankrollHistoryPoint = async (
    point: Omit<BankrollHistory, 'id' | 'user_id' | 'created_at'>,
) => {
  const { data, error } = await supabase
      .from('bankroll_history')
      .insert(point)
      .select()
      .single()
  return handle('addBankrollHistoryPoint', data, error) as BankrollHistory
}

export const loadBankrollHistory = async (): Promise<BankrollHistory[]> => {
  const { data, error } = await supabase
      .from('bankroll_history')
      .select('*')
      .order('date', { ascending: true })
  return handle('loadBankrollHistory', data, error)
}

export const createJournalEntry = async (
    entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) => {
  const { data, error } = await supabase.from('journal_entries').insert(entry).select().single()
  return handle('createJournalEntry', data, error) as JournalEntry
}

export const deleteJournalEntry = async (id: string) => {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  if (error) throw error
}

export const loadJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false })
  return handle('loadJournalEntries', data, error)
}

const emptyParams: HourlyRateParams = {
  bb_amount: 0,
  bb_per_hour: 0,
  rakeback_hourly: 0,
  monthly_hours: 0,
  monthly_expenses: 0,
}

export const saveHourlyRateParams = async (params: HourlyRateParams) => {
  const { data, error } = await supabase
      .from('hourly_rate_params')
      .upsert(params, { onConflict: 'user_id' })
      .select()
      .single()
  return handle('saveHourlyRateParams', data, error) as HourlyRateParams
}

export const loadHourlyRateParams = async (): Promise<HourlyRateParams> => {
  const uid = await getUid()
  if (!uid) return emptyParams
  const { data, error } = await supabase
      .from('hourly_rate_params')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()
  return handle('loadHourlyRateParams', data ?? emptyParams, error)
}

export const saveSimulatorConfig = async (config: Omit<SimulatorConfig, 'id'>) => {
  const { data, error } = await supabase
      .from('simulator_configs')
      .insert(config)
      .select()
      .single()
  return handle('saveSimulatorConfig', data, error) as SimulatorConfig
}

export const loadSimulatorConfigs = async (): Promise<SimulatorConfig[]> => {
  const { data, error } = await supabase
      .from('simulator_configs')
      .select('*')
      .order('created_at', { ascending: false })
  return handle('loadSimulatorConfigs', data, error)
}

export const deleteSimulatorConfig = async (id: string) => {
  const { error } = await supabase.from('simulator_configs').delete().eq('id', id)
  if (error) throw error
}

export const loadAllData = async () => {
  const [items, history, entries, params, configs] = await Promise.all([
    loadBankrollItems(),
    loadBankrollHistory(),
    loadJournalEntries(),
    loadHourlyRateParams(),
    loadSimulatorConfigs(),
  ])
  return { 
    bankrollItems: items, 
    bankrollHistory: history, 
    journalEntries: entries, 
    hourlyRateParams: params,
    simulatorConfigs: configs,
  }
}