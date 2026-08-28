import Dexie, { type Table } from 'dexie'
import type { ActiveTimer, Settings, WorkSession } from './types'

export const defaultSettings: Settings = {
  id: 'settings',
  freelancerName: '',
  businessName: '',
  defaultClient: '',
  receiptNote: 'This receipt is a self-reported record of work completed. It is not independent verification.',
  updatedAt: new Date(0).toISOString(),
}

class WorkReceiptDB extends Dexie {
  sessions!: Table<WorkSession, string>
  settings!: Table<Settings, string>

  constructor() {
    super('work-receipt')
    this.version(1).stores({
      sessions: 'id, startedAt, project, updatedAt',
      settings: 'id',
    })
  }
}

export const db = new WorkReceiptDB()

export async function allSessions(): Promise<WorkSession[]> {
  return db.sessions.orderBy('startedAt').reverse().toArray()
}

export async function getSettings(): Promise<Settings> {
  return (await db.settings.get('settings')) ?? defaultSettings
}

export const TIMER_KEY = 'work-receipt:active-timer'

export function getActiveTimer(): ActiveTimer | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    return raw ? JSON.parse(raw) as ActiveTimer : null
  } catch {
    return null
  }
}

export function setActiveTimer(timer: ActiveTimer | null): void {
  if (timer) localStorage.setItem(TIMER_KEY, JSON.stringify(timer))
  else localStorage.removeItem(TIMER_KEY)
}
