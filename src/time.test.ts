import { describe, expect, it } from 'vitest'
import { durationMinutes, formatDuration, sessionsInRange, validateSession } from './time'
import type { WorkSession } from './types'

const base: WorkSession = {
  id: 'one', project: 'Atlas', outcome: 'Shipped the review flow', evidence: '', aiAssisted: false,
  interruptionMinutes: 15, startedAt: '2026-08-24T09:00:00.000Z', endedAt: '2026-08-24T10:30:00.000Z',
  createdAt: '2026-08-24T10:30:00.000Z', updatedAt: '2026-08-24T10:30:00.000Z',
}

describe('work session time', () => {
  it('subtracts explicitly declared interruptions', () => expect(durationMinutes(base)).toBe(75))
  it('formats billable duration compactly', () => expect(formatDuration(135)).toBe('2h 15m'))
  it('filters by a half-open date range', () => expect(sessionsInRange([base], new Date('2026-08-24'), new Date('2026-08-31'))).toEqual([base]))
})

describe('session validation', () => {
  it('requires a project and client-readable outcome', () => expect(validateSession({ ...base, outcome: '' })).toMatch(/outcome/i))
  it('rejects an end before the start', () => expect(validateSession({ ...base, endedAt: '2026-08-24T08:00:00.000Z' })).toMatch(/after start/i))
  it('rejects a break that consumes the whole session', () => expect(validateSession({ ...base, interruptionMinutes: 90 })).toMatch(/shorter/i))
  it('accepts a valid session', () => expect(validateSession(base)).toBeNull())
})
