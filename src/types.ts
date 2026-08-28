export type WorkSession = {
  id: string
  project: string
  outcome: string
  evidence: string
  aiAssisted: boolean
  interruptionMinutes: number
  startedAt: string
  endedAt: string
  createdAt: string
  updatedAt: string
}

export type ActiveTimer = {
  startedAt: string
  project: string
  outcome: string
  evidence: string
  aiAssisted: boolean
}

export type Settings = {
  id: 'settings'
  freelancerName: string
  businessName: string
  defaultClient: string
  receiptNote: string
  updatedAt: string
}

export type ExportBundle = {
  format: 'work-receipt-backup'
  version: 1
  exportedAt: string
  sessions: WorkSession[]
  settings: Settings
}
