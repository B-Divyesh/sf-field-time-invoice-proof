import type { WorkSession } from './types'

export const pad = (n: number) => String(n).padStart(2, '0')

export function toLocalInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function durationMinutes(session: Pick<WorkSession, 'startedAt' | 'endedAt' | 'interruptionMinutes'>): number {
  const elapsed = Math.round((Date.parse(session.endedAt) - Date.parse(session.startedAt)) / 60000)
  return Math.max(0, elapsed - (session.interruptionMinutes || 0))
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (!hours) return `${mins}m`
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}

export function weekBounds(offset = 0): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now)
  const day = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - day + offset * 7)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return { start, end }
}

export function sessionsInRange(sessions: WorkSession[], start: Date, end: Date): WorkSession[] {
  return sessions.filter((session) => {
    const time = Date.parse(session.startedAt)
    return time >= start.getTime() && time < end.getTime()
  })
}

export function validateSession(session: Pick<WorkSession, 'project' | 'outcome' | 'startedAt' | 'endedAt' | 'interruptionMinutes'>): string | null {
  if (!session.project.trim()) return 'Add a project name.'
  if (!session.outcome.trim()) return 'Describe the outcome your client will recognise.'
  if (!session.startedAt || !session.endedAt) return 'Add a start and end time.'
  if (Date.parse(session.endedAt) <= Date.parse(session.startedAt)) return 'End time must be after start time.'
  const elapsed = (Date.parse(session.endedAt) - Date.parse(session.startedAt)) / 60000
  if (session.interruptionMinutes < 0 || session.interruptionMinutes >= elapsed) return 'Break time must be shorter than the session.'
  return null
}
