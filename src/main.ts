import './styles.css'
import { allSessions, db, defaultSettings, getActiveTimer, getSettings, setActiveTimer } from './db'
import { durationMinutes, formatDuration, sessionsInRange, toLocalInput, validateSession, weekBounds } from './time'
import type { ActiveTimer, ExportBundle, Settings, WorkSession } from './types'

const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG || 'field-time-invoice-proof'
const BILLING_BASE = import.meta.env.VITE_BILLING_BASE || 'https://api.sociobot.in'
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`
const VERDICT_KEY = `${LICENSE_KEY}:verdict`

const state: {
  sessions: WorkSession[]
  settings: Settings
  timer: ActiveTimer | null
  now: number
  filter: string
  weekOffset: number
  licensed: boolean
} = {
  sessions: [],
  settings: defaultSettings,
  timer: getActiveTimer(),
  now: Date.now(),
  filter: '',
  weekOffset: 0,
  licensed: false,
}

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="/" aria-label="Work Receipt home">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>Work Receipt</span>
    </a>
    <div class="header-actions">
      <span id="connection-status" class="connection" role="status"></span>
      <button class="text-button" id="open-license" type="button">Studio unlock</button>
    </div>
  </header>
  <main id="main">
    <section class="intro" aria-labelledby="page-title">
      <div class="intro-copy">
        <p class="eyebrow">Private field notes for billable work</p>
        <h1 id="page-title">Show the work.<br><em>Keep your privacy.</em></h1>
        <p class="lede">Record what happened, account for interruptions, and make a clear weekly PDF for your client. No screenshots. No keystrokes. Nothing leaves this device.</p>
        <div class="trust-line"><span aria-hidden="true">✓</span> Self-reported by design</div>
      </div>
      <figure class="hero-figure">
        <picture>
          <source type="image/webp" srcset="/assets/hero-notebook-720.webp 720w, /assets/hero-notebook-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 46vw" />
          <img src="/assets/hero-notebook-1200.webp" width="1200" height="800" alt="Open field notebook beside a stopwatch, fountain pen and small spark token" fetchpriority="high" decoding="async" />
        </picture>
        <figcaption>Your record is a statement of work, not surveillance.</figcaption>
      </figure>
    </section>

    <section class="workbench" aria-labelledby="log-title">
      <aside class="timer-panel" aria-labelledby="timer-title">
        <p class="folio">FIELD TIMER · LOCAL ONLY</p>
        <h2 id="timer-title">Keep a time note</h2>
        <div id="timer-view"></div>
        <div class="privacy-note">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm0 4v12m-4-7 2.4 2.4L16 8"/></svg>
          <p><strong>No activity capture.</strong><br>Your notes and evidence links stay in this browser.</p>
        </div>
      </aside>

      <div class="notebook">
        <div class="section-heading">
          <div>
            <p class="folio">WORK LOG</p>
            <h2 id="log-title">Recent field notes</h2>
          </div>
          <button class="button button-secondary" id="add-session" type="button"><span aria-hidden="true">＋</span> Add manually</button>
        </div>
        <div class="log-tools">
          <label for="project-filter">Filter notes</label>
          <select id="project-filter"><option value="">All projects</option></select>
        </div>
        <div id="session-list" aria-live="polite"></div>
      </div>
    </section>

    <section class="receipt-strip" aria-labelledby="receipt-title">
      <div>
        <p class="eyebrow">Ready for invoice day</p>
        <h2 id="receipt-title">Turn the week into a receipt.</h2>
        <p>A calm, client-readable PDF with outcomes, time, interruptions, and only the evidence you chose to share.</p>
      </div>
      <button class="button button-paper" id="open-receipt" type="button">Prepare weekly receipt <span aria-hidden="true">→</span></button>
    </section>

    <section class="ownership" aria-labelledby="ownership-title">
      <div>
        <p class="folio">YOUR DATA, YOUR EXIT</p>
        <h2 id="ownership-title">A notebook with an open back cover.</h2>
        <p>Back up everything as JSON or take a spreadsheet-friendly CSV. Import a backup on another device whenever you need it.</p>
      </div>
      <div class="ownership-actions">
        <button class="text-button" id="export-json" type="button">Export backup (.json)</button>
        <button class="text-button" id="export-csv" type="button">Export sessions (.csv)</button>
        <label class="text-button file-label" for="import-json">Import backup</label>
        <input class="visually-hidden" id="import-json" type="file" accept="application/json,.json" />
      </div>
    </section>
  </main>
  <footer>
    <p><strong>Work Receipt</strong> · local-first, self-reported work records.</p>
    <nav aria-label="Legal and product links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><button class="linklike" id="footer-license" type="button">License</button></nav>
    <p class="fine-print">Still-life artwork generated for this product with Azure OpenAI. No client data is used in the image.</p>
  </footer>

  <dialog id="session-dialog" aria-labelledby="session-dialog-title">
    <form id="session-form" method="dialog">
      <div class="dialog-head"><div><p class="folio">FIELD NOTE</p><h2 id="session-dialog-title">Add a session</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close session form">×</button></div>
      <input id="session-id" type="hidden" />
      <div class="form-grid two">
        <label>Project <span aria-hidden="true">*</span><input id="session-project" required maxlength="80" autocomplete="organization-title" /></label>
        <label>Break / interruption <span class="hint">minutes</span><input id="session-break" type="number" min="0" step="1" value="0" inputmode="numeric" /></label>
      </div>
      <label>Outcome for the client <span aria-hidden="true">*</span><textarea id="session-outcome" required maxlength="500" rows="3"></textarea><span class="hint">Say what changed—not every keystroke.</span></label>
      <div class="form-grid two">
        <label>Started <input id="session-start" type="datetime-local" required /></label>
        <label>Ended <input id="session-end" type="datetime-local" required /></label>
      </div>
      <label>Evidence link <span class="hint">optional, http(s) only</span><input id="session-evidence" type="url" inputmode="url" placeholder="https://github.com/…" /></label>
      <label class="check-label"><input id="session-ai" type="checkbox" /><span><strong>AI-assisted work</strong><small>Marks the note transparently; it never reduces billable time.</small></span></label>
      <p id="session-error" class="form-error" role="alert"></p>
      <div class="dialog-actions"><button class="text-button close-dialog" type="button">Cancel</button><button class="button" type="submit">Save field note</button></div>
    </form>
  </dialog>

  <dialog id="receipt-dialog" class="wide-dialog" aria-labelledby="receipt-dialog-title">
    <div class="dialog-head"><div><p class="folio">CLIENT COPY</p><h2 id="receipt-dialog-title">Prepare weekly receipt</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close receipt preview">×</button></div>
    <div class="week-picker"><button class="icon-button" id="prev-week" aria-label="Previous week">←</button><strong id="week-label"></strong><button class="icon-button" id="next-week" aria-label="Next week">→</button></div>
    <label>Client or recipient <input id="receipt-client" maxlength="100" placeholder="Client name" /></label>
    <div id="receipt-preview" class="receipt-preview"></div>
    <div class="dialog-actions"><button class="text-button close-dialog" type="button">Close</button><button class="button" id="download-pdf" type="button">Download PDF</button></div>
  </dialog>

  <dialog id="license-dialog" aria-labelledby="license-title">
    <div class="dialog-head"><div><p class="folio">ONE-TIME UNLOCK</p><h2 id="license-title">Make it unmistakably yours</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close Studio unlock">×</button></div>
    <div id="license-state"></div>
  </dialog>

  <dialog id="settings-dialog" aria-labelledby="settings-title">
    <form id="settings-form" method="dialog">
      <div class="dialog-head"><div><p class="folio">STUDIO DETAILS</p><h2 id="settings-title">Receipt identity</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close receipt identity">×</button></div>
      <label>Your name <input id="settings-name" maxlength="100" /></label>
      <label>Business or studio <input id="settings-business" maxlength="100" /></label>
      <label>Default client <input id="settings-client" maxlength="100" /></label>
      <label>Receipt note <textarea id="settings-note" maxlength="300" rows="3"></textarea></label>
      <div class="dialog-actions"><button class="text-button close-dialog" type="button">Cancel</button><button class="button" type="submit">Save identity</button></div>
    </form>
  </dialog>

  <div id="toast" class="toast" role="status" aria-live="polite"></div>
`

const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!)
const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

function showToast(message: string): void {
  const toast = $('#toast')
  toast.textContent = message
  toast.classList.add('visible')
  window.setTimeout(() => toast.classList.remove('visible'), 2800)
}

function setConnectionStatus(): void {
  const el = $('#connection-status')
  el.textContent = navigator.onLine ? '● Saved on device' : '○ Offline · saving on this device'
  el.classList.toggle('offline', !navigator.onLine)
}

function renderTimer(): void {
  const view = $('#timer-view')
  if (!state.timer) {
    view.innerHTML = `
      <form id="timer-form">
        <label>Project <input id="timer-project" maxlength="80" required placeholder="e.g. Acme redesign" /></label>
        <label>Working toward <textarea id="timer-outcome" maxlength="500" required rows="3" placeholder="A client-readable outcome"></textarea></label>
        <label>Evidence link <span class="hint">optional</span><input id="timer-evidence" type="url" placeholder="https://…" /></label>
        <label class="check-label compact"><input id="timer-ai" type="checkbox" /><span>AI-assisted</span></label>
        <button class="button timer-button" type="submit"><span aria-hidden="true">▶</span> Start session</button>
      </form>`
    $('#timer-form').addEventListener('submit', startTimer)
    return
  }
  const elapsed = Math.max(0, Math.floor((state.now - Date.parse(state.timer.startedAt)) / 1000))
  const hours = Math.floor(elapsed / 3600)
  const mins = Math.floor((elapsed % 3600) / 60)
  const secs = elapsed % 60
  view.innerHTML = `
    <div class="running-note">
      <p class="running-label"><span class="record-dot" aria-hidden="true"></span> Recording a self-reported session</p>
      <p class="timer-clock" aria-label="Elapsed time ${hours} hours ${mins} minutes ${secs} seconds">${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</p>
      <h3>${escapeHtml(state.timer.project)}</h3>
      <p>${escapeHtml(state.timer.outcome)}</p>
      ${state.timer.aiAssisted ? '<span class="tag">✦ AI-assisted</span>' : ''}
      <button id="stop-timer" class="button button-stop" type="button"><span aria-hidden="true">■</span> Stop & save</button>
      <button id="discard-timer" class="text-button danger-text" type="button">Discard timer</button>
    </div>`
  $('#stop-timer').addEventListener('click', stopTimer)
  $('#discard-timer').addEventListener('click', discardTimer)
}

function startTimer(event: Event): void {
  event.preventDefault()
  const project = ($('#timer-project') as HTMLInputElement).value.trim()
  const outcome = ($('#timer-outcome') as HTMLTextAreaElement).value.trim()
  const evidence = ($('#timer-evidence') as HTMLInputElement).value.trim()
  if (!project || !outcome) return
  state.timer = { project, outcome, evidence, aiAssisted: ($('#timer-ai') as HTMLInputElement).checked, startedAt: new Date().toISOString() }
  setActiveTimer(state.timer)
  state.now = Date.now()
  renderTimer()
  showToast('Timer started · it will survive a refresh')
}

async function stopTimer(): Promise<void> {
  if (!state.timer) return
  const endedAt = new Date()
  const startedAt = new Date(state.timer.startedAt)
  if (endedAt.getTime() - startedAt.getTime() < 60_000) endedAt.setTime(startedAt.getTime() + 60_000)
  const now = new Date().toISOString()
  const session: WorkSession = { id: uid(), ...state.timer, interruptionMinutes: 0, endedAt: endedAt.toISOString(), createdAt: now, updatedAt: now }
  await db.sessions.add(session)
  state.timer = null
  setActiveTimer(null)
  await refreshSessions()
  renderTimer()
  showToast('Session saved on this device')
}

function discardTimer(): void {
  if (!state.timer || !confirm(`Discard the running timer for “${state.timer.project}”? No session will be saved.`)) return
  state.timer = null
  setActiveTimer(null)
  renderTimer()
  showToast('Timer discarded')
}

function uniqueProjects(): string[] {
  return [...new Set(state.sessions.map((s) => s.project))].sort((a, b) => a.localeCompare(b))
}

function renderSessions(): void {
  const select = $('#project-filter') as HTMLSelectElement
  const selected = state.filter
  select.innerHTML = '<option value="">All projects</option>' + uniqueProjects().map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')
  select.value = selected
  const sessions = state.sessions.filter((s) => !selected || s.project === selected)
  const container = $('#session-list')
  if (!sessions.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-mark" aria-hidden="true">↳</div><h3>${selected ? 'No notes for this project' : 'Your first note starts here'}</h3><p>${selected ? 'Choose another project or add a session.' : 'Start the field timer or add work you already completed. Every save appears here immediately.'}</p><button class="text-button" id="empty-add" type="button">Add a field note →</button></div>`
    $('#empty-add').addEventListener('click', () => openSessionDialog())
    return
  }
  container.innerHTML = `<ol class="session-list">${sessions.map((s) => {
    const start = new Date(s.startedAt)
    const end = new Date(s.endedAt)
    const evidence = safeUrl(s.evidence)
    return `<li class="session-entry" data-id="${s.id}">
      <div class="session-date"><span>${dateFormat.format(start)}</span><small>${timeFormat.format(start)}–${timeFormat.format(end)}</small></div>
      <div class="session-body"><div class="entry-top"><h3>${escapeHtml(s.project)}</h3><strong>${formatDuration(durationMinutes(s))}</strong></div><p>${escapeHtml(s.outcome)}</p><div class="meta-row"><span class="tag">Self-reported</span>${s.aiAssisted ? '<span class="tag ai-tag">✦ AI-assisted</span>' : ''}${s.interruptionMinutes ? `<span>Break: ${s.interruptionMinutes}m</span>` : ''}${evidence ? `<a href="${escapeHtml(evidence)}" target="_blank" rel="noreferrer">Open evidence ↗</a>` : ''}</div></div>
      <div class="entry-actions"><button class="icon-button edit-session" type="button" aria-label="Edit ${escapeHtml(s.project)} session">Edit</button><button class="icon-button delete-session" type="button" aria-label="Delete ${escapeHtml(s.project)} session">×</button></div>
    </li>`
  }).join('')}</ol>`
  container.querySelectorAll<HTMLButtonElement>('.edit-session').forEach((button) => button.addEventListener('click', () => openSessionDialog(button.closest('li')!.getAttribute('data-id')!)))
  container.querySelectorAll<HTMLButtonElement>('.delete-session').forEach((button) => button.addEventListener('click', () => deleteSession(button.closest('li')!.getAttribute('data-id')!)))
}

function safeUrl(value: string): string {
  if (!value) return ''
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch { return '' }
}

async function refreshSessions(): Promise<void> {
  state.sessions = await allSessions()
  renderSessions()
}

function openSessionDialog(id?: string): void {
  const dialog = $('#session-dialog') as HTMLDialogElement
  const session = id ? state.sessions.find((s) => s.id === id) : undefined
  const end = new Date()
  end.setSeconds(0, 0)
  const start = new Date(end.getTime() - 60 * 60 * 1000)
  ;($('#session-dialog-title')).textContent = session ? 'Edit session' : 'Add a session'
  ;($('#session-id') as HTMLInputElement).value = session?.id ?? ''
  ;($('#session-project') as HTMLInputElement).value = session?.project ?? state.filter
  ;($('#session-outcome') as HTMLTextAreaElement).value = session?.outcome ?? ''
  ;($('#session-break') as HTMLInputElement).value = String(session?.interruptionMinutes ?? 0)
  ;($('#session-start') as HTMLInputElement).value = toLocalInput(session ? new Date(session.startedAt) : start)
  ;($('#session-end') as HTMLInputElement).value = toLocalInput(session ? new Date(session.endedAt) : end)
  ;($('#session-evidence') as HTMLInputElement).value = session?.evidence ?? ''
  ;($('#session-ai') as HTMLInputElement).checked = session?.aiAssisted ?? false
  ;($('#session-error')).textContent = ''
  dialog.showModal()
  window.setTimeout(() => ($('#session-project') as HTMLInputElement).focus(), 0)
}

async function saveSession(event: Event): Promise<void> {
  event.preventDefault()
  const id = ($('#session-id') as HTMLInputElement).value || uid()
  const existing = state.sessions.find((s) => s.id === id)
  const evidence = ($('#session-evidence') as HTMLInputElement).value.trim()
  const now = new Date().toISOString()
  const session: WorkSession = {
    id,
    project: ($('#session-project') as HTMLInputElement).value.trim(),
    outcome: ($('#session-outcome') as HTMLTextAreaElement).value.trim(),
    interruptionMinutes: Number(($('#session-break') as HTMLInputElement).value || 0),
    startedAt: new Date(($('#session-start') as HTMLInputElement).value).toISOString(),
    endedAt: new Date(($('#session-end') as HTMLInputElement).value).toISOString(),
    evidence,
    aiAssisted: ($('#session-ai') as HTMLInputElement).checked,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  const error = validateSession(session) || (evidence && !safeUrl(evidence) ? 'Evidence must be a valid http or https link.' : null)
  if (error) { $('#session-error').textContent = error; return }
  await db.sessions.put(session)
  ;($('#session-dialog') as HTMLDialogElement).close()
  await refreshSessions()
  showToast(existing ? 'Field note updated' : 'Field note saved on this device')
}

async function deleteSession(id: string): Promise<void> {
  const session = state.sessions.find((s) => s.id === id)
  if (!session || !confirm(`Delete the ${formatDuration(durationMinutes(session))} “${session.project}” session? This cannot be undone.`)) return
  await db.sessions.delete(id)
  await refreshSessions()
  showToast('Session deleted')
}

function renderReceipt(): void {
  const { start, end } = weekBounds(state.weekOffset)
  const sessions = sessionsInRange(state.sessions, start, end)
  const endLabel = new Date(end); endLabel.setDate(endLabel.getDate() - 1)
  $('#week-label').textContent = `${dateFormat.format(start)} – ${dateFormat.format(endLabel)}`
  ;($('#next-week') as HTMLButtonElement).disabled = state.weekOffset >= 0
  const total = sessions.reduce((sum, s) => sum + durationMinutes(s), 0)
  const projects = [...new Set(sessions.map((s) => s.project))]
  $('#receipt-preview').innerHTML = `
    <div class="receipt-letterhead"><div><span class="receipt-logo">WR</span><strong>${escapeHtml(state.licensed && state.settings.businessName ? state.settings.businessName : 'Work Receipt')}</strong></div><span>SELF-REPORTED WORK RECORD</span></div>
    <div class="receipt-to"><div><small>PREPARED FOR</small><strong>${escapeHtml((($('#receipt-client') as HTMLInputElement).value || 'Client copy'))}</strong></div><div><small>TOTAL TIME</small><strong>${formatDuration(total)}</strong></div></div>
    ${sessions.length ? `<ol>${sessions.map((s) => `<li><div><strong>${escapeHtml(s.outcome)}</strong><span>${escapeHtml(s.project)} · ${dateFormat.format(new Date(s.startedAt))}${s.aiAssisted ? ' · AI-assisted' : ''}${s.interruptionMinutes ? ` · ${s.interruptionMinutes}m break excluded` : ''}</span></div><b>${formatDuration(durationMinutes(s))}</b></li>`).join('')}</ol>` : '<div class="receipt-empty"><strong>No sessions in this week.</strong><span>Choose an earlier week or close this preview and add a note.</span></div>'}
    <div class="receipt-foot"><span>${projects.length} project${projects.length === 1 ? '' : 's'} · ${sessions.length} session${sessions.length === 1 ? '' : 's'}</span><p>${escapeHtml(state.licensed ? state.settings.receiptNote : defaultSettings.receiptNote)}</p></div>`
  ;($('#download-pdf') as HTMLButtonElement).disabled = !sessions.length
}

function openReceipt(): void {
  state.weekOffset = 0
  ;($('#receipt-client') as HTMLInputElement).value = state.settings.defaultClient
  renderReceipt()
  ;($('#receipt-dialog') as HTMLDialogElement).showModal()
}

async function downloadPdf(): Promise<void> {
  const { start, end } = weekBounds(state.weekOffset)
  const sessions = sessionsInRange(state.sessions, start, end)
  if (!sessions.length) return
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const client = ($('#receipt-client') as HTMLInputElement).value.trim() || 'Client copy'
  const total = sessions.reduce((sum, s) => sum + durationMinutes(s), 0)
  const endLabel = new Date(end); endLabel.setDate(endLabel.getDate() - 1)
  const brand = state.licensed && state.settings.businessName ? state.settings.businessName : 'Work Receipt'
  doc.setFillColor(244, 238, 220); doc.rect(0, 0, 595, 842, 'F')
  doc.setFillColor(255, 253, 246); doc.roundedRect(36, 36, 523, 770, 4, 4, 'F')
  doc.setDrawColor(23, 107, 100); doc.setLineWidth(2); doc.line(64, 92, 531, 92)
  doc.setTextColor(23, 35, 33); doc.setFont('times', 'bold'); doc.setFontSize(23); doc.text(brand, 64, 75)
  doc.setFont('courier', 'normal'); doc.setFontSize(8); doc.setTextColor(75, 87, 82); doc.text('SELF-REPORTED WORK RECORD', 531, 72, { align: 'right' })
  doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.text('PREPARED FOR', 64, 124); doc.text('WEEK', 280, 124); doc.text('TOTAL TIME', 531, 124, { align: 'right' })
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(23, 35, 33); doc.text(client, 64, 143)
  doc.setFont('helvetica', 'normal'); doc.text(`${dateFormat.format(start)} – ${dateFormat.format(endLabel)}`, 280, 143)
  doc.setFont('courier', 'bold'); doc.setFontSize(16); doc.text(formatDuration(total), 531, 143, { align: 'right' })
  let y = 184
  sessions.forEach((session, index) => {
    if (y > 700) { doc.addPage(); doc.setFillColor(244, 238, 220); doc.rect(0, 0, 595, 842, 'F'); y = 64 }
    doc.setTextColor(163, 58, 43); doc.setFont('courier', 'bold'); doc.setFontSize(9); doc.text(String(index + 1).padStart(2, '0'), 64, y)
    doc.setTextColor(23, 35, 33); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
    const lines = doc.splitTextToSize(session.outcome, 340) as string[]; doc.text(lines, 96, y)
    doc.setFont('courier', 'bold'); doc.text(formatDuration(durationMinutes(session)), 531, y, { align: 'right' })
    const metaY = y + lines.length * 13 + 4
    doc.setTextColor(75, 87, 82); doc.setFont('helvetica', 'normal'); doc.setFontSize(8)
    const meta = `${session.project} · ${dateFormat.format(new Date(session.startedAt))}${session.aiAssisted ? ' · AI-assisted' : ''}${session.interruptionMinutes ? ` · ${session.interruptionMinutes}m break excluded` : ''}`
    doc.text(meta, 96, metaY)
    if (safeUrl(session.evidence)) { doc.setTextColor(23, 107, 100); doc.textWithLink('Evidence link', 96, metaY + 13, { url: safeUrl(session.evidence) }); y = metaY + 42 } else y = metaY + 29
    doc.setDrawColor(199, 209, 198); doc.setLineWidth(.5); doc.line(64, y - 12, 531, y - 12)
  })
  const note = state.licensed ? state.settings.receiptNote : defaultSettings.receiptNote
  doc.setTextColor(75, 87, 82); doc.setFont('times', 'italic'); doc.setFontSize(9); doc.text(doc.splitTextToSize(note, 430), 64, Math.min(y + 18, 770))
  doc.setFont('courier', 'normal'); doc.setFontSize(7); doc.text(`Generated locally with Work Receipt · ${new Date().toLocaleDateString()}`, 64, 788)
  doc.save(`work-receipt-${start.toISOString().slice(0, 10)}.pdf`)
  showToast('PDF receipt downloaded')
}

function download(name: string, body: string, type: string): void {
  const url = URL.createObjectURL(new Blob([body], { type }))
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
  URL.revokeObjectURL(url)
}

function exportJson(): void {
  const bundle: ExportBundle = { format: 'work-receipt-backup', version: 1, exportedAt: new Date().toISOString(), sessions: state.sessions, settings: state.settings }
  download(`work-receipt-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(bundle, null, 2), 'application/json')
  showToast('Private backup exported')
}

function exportCsv(): void {
  const rows = [['Project', 'Outcome', 'Started', 'Ended', 'Break minutes', 'Billable minutes', 'AI-assisted', 'Evidence'], ...state.sessions.map((s) => [s.project, s.outcome, s.startedAt, s.endedAt, String(s.interruptionMinutes), String(durationMinutes(s)), s.aiAssisted ? 'Yes' : 'No', s.evidence])]
  const csv = rows.map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\r\n')
  download(`work-receipt-sessions-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8')
  showToast('CSV exported')
}

async function importJson(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const bundle = JSON.parse(await file.text()) as ExportBundle
    if (bundle.format !== 'work-receipt-backup' || bundle.version !== 1 || !Array.isArray(bundle.sessions)) throw new Error('wrong format')
    for (const session of bundle.sessions) if (validateSession(session)) throw new Error('invalid session')
    if (!confirm(`Import ${bundle.sessions.length} session${bundle.sessions.length === 1 ? '' : 's'}? Matching IDs will be replaced with the newer backup copy.`)) return
    await db.transaction('rw', db.sessions, db.settings, async () => {
      await db.sessions.bulkPut(bundle.sessions)
      if (bundle.settings?.id === 'settings') await db.settings.put(bundle.settings)
    })
    state.settings = await getSettings(); await refreshSessions(); showToast('Backup imported successfully')
  } catch { showToast('That file is not a valid Work Receipt backup') }
  finally { input.value = '' }
}

function cachedLicense(): boolean {
  const token = localStorage.getItem(LICENSE_KEY)
  if (!token) return false
  try { const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}'); return verdict.valid === true } catch { return false }
}

async function verifyLicense(force = false): Promise<void> {
  const token = localStorage.getItem(LICENSE_KEY)
  if (!token) { state.licensed = false; renderLicense(); return }
  let verdict: { valid?: boolean; checkedAt?: number } = {}
  try { verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}') } catch { /* ignore */ }
  state.licensed = verdict.valid === true
  renderLicense()
  if (!navigator.onLine || (!force && verdict.checkedAt && Date.now() - verdict.checkedAt < 86_400_000)) return
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`)
    if (!response.ok) throw new Error('verify unavailable')
    const result = await response.json() as { valid: boolean; reason: string }
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, reason: result.reason, checkedAt: Date.now() }))
    state.licensed = result.valid
    renderLicense()
    if (!result.valid) showToast('Studio license is no longer active')
  } catch { /* cached verdict remains; free app is never blocked */ }
}

function renderLicense(): void {
  const target = $('#license-state')
  if (state.licensed) {
    target.innerHTML = `<div class="license-active"><span class="stamp">UNLOCKED</span><h3>Studio details are active.</h3><p>Add your name, business identity, default client, and closing note to every receipt.</p><button class="button" id="open-settings" type="button">Edit receipt identity</button><button class="text-button" id="remove-license" type="button">Remove license from this device</button></div>`
    $('#open-settings').addEventListener('click', openSettings)
    $('#remove-license').addEventListener('click', () => { if (confirm('Remove this license from this device? Your work notes will not be affected.')) { localStorage.removeItem(LICENSE_KEY); localStorage.removeItem(VERDICT_KEY); state.licensed = false; renderLicense() } })
  } else {
    target.innerHTML = `<p class="license-price"><strong>$19</strong> once</p><p>Core recording, weekly PDFs, and data exports are free. Studio unlock adds your business identity, default client, and custom receipt note. No subscription.</p><a class="button buy-link" href="${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/checkout">Buy Studio unlock</a><hr><form id="restore-form"><label>Have a license? Paste it here<input id="license-token" required autocomplete="off" /></label><p id="license-error" class="form-error" role="alert"></p><button class="button button-secondary" type="submit">Verify license</button></form><p class="fine-print">Sociobot / Dodo is the merchant of record. Refunds are handled there and revoke the license. See <a href="/terms/">terms</a> and <a href="/privacy/">privacy</a>.</p>`
    $('#restore-form').addEventListener('submit', async (event) => { event.preventDefault(); const token = ($('#license-token') as HTMLInputElement).value.trim(); if (!token) return; localStorage.setItem(LICENSE_KEY, token); localStorage.removeItem(VERDICT_KEY); await verifyLicense(true); if (!state.licensed) $('#license-error').textContent = 'That license could not be verified. Check the token and try again.' })
  }
  $('#open-license').textContent = state.licensed ? 'Studio · unlocked' : 'Studio unlock'
}

function openSettings(): void {
  ;($('#license-dialog') as HTMLDialogElement).close()
  ;($('#settings-name') as HTMLInputElement).value = state.settings.freelancerName
  ;($('#settings-business') as HTMLInputElement).value = state.settings.businessName
  ;($('#settings-client') as HTMLInputElement).value = state.settings.defaultClient
  ;($('#settings-note') as HTMLTextAreaElement).value = state.settings.receiptNote
  ;($('#settings-dialog') as HTMLDialogElement).showModal()
}

async function saveSettings(event: Event): Promise<void> {
  event.preventDefault()
  state.settings = { id: 'settings', freelancerName: ($('#settings-name') as HTMLInputElement).value.trim(), businessName: ($('#settings-business') as HTMLInputElement).value.trim(), defaultClient: ($('#settings-client') as HTMLInputElement).value.trim(), receiptNote: ($('#settings-note') as HTMLTextAreaElement).value.trim() || defaultSettings.receiptNote, updatedAt: new Date().toISOString() }
  await db.settings.put(state.settings)
  ;($('#settings-dialog') as HTMLDialogElement).close(); showToast('Receipt identity saved on this device')
}

function setupEvents(): void {
  $('#add-session').addEventListener('click', () => openSessionDialog())
  $('#session-form').addEventListener('submit', saveSession)
  $('#project-filter').addEventListener('change', (event) => { state.filter = (event.target as HTMLSelectElement).value; renderSessions() })
  $('#open-receipt').addEventListener('click', openReceipt)
  $('#prev-week').addEventListener('click', () => { state.weekOffset--; renderReceipt() })
  $('#next-week').addEventListener('click', () => { if (state.weekOffset < 0) state.weekOffset++; renderReceipt() })
  $('#receipt-client').addEventListener('input', renderReceipt)
  $('#download-pdf').addEventListener('click', downloadPdf)
  $('#export-json').addEventListener('click', exportJson)
  $('#export-csv').addEventListener('click', exportCsv)
  $('#import-json').addEventListener('change', importJson)
  $('#settings-form').addEventListener('submit', saveSettings)
  ;['#open-license', '#footer-license'].forEach((selector) => $(selector).addEventListener('click', () => { renderLicense(); ($('#license-dialog') as HTMLDialogElement).showModal() }))
  document.querySelectorAll<HTMLButtonElement>('.close-dialog').forEach((button) => button.addEventListener('click', () => (button.closest('dialog') as HTMLDialogElement).close()))
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close() }))
  window.addEventListener('online', () => { setConnectionStatus(); verifyLicense() })
  window.addEventListener('offline', setConnectionStatus)
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready · reload to use it') })
    })
  } catch { /* the app remains fully usable without install support */ }
}

async function init(): Promise<void> {
  const returnedLicense = new URLSearchParams(location.search).get('license')
  if (returnedLicense) {
    localStorage.setItem(LICENSE_KEY, returnedLicense); localStorage.removeItem(VERDICT_KEY)
    const url = new URL(location.href); url.searchParams.delete('license'); history.replaceState({}, '', url.pathname + url.search + url.hash)
  }
  state.licensed = cachedLicense()
  try { [state.sessions, state.settings] = await Promise.all([allSessions(), getSettings()]) }
  catch { showToast('Local storage could not be opened. Check private browsing settings.') }
  setupEvents(); renderTimer(); renderSessions(); renderLicense(); setConnectionStatus(); verifyLicense(); registerServiceWorker()
  window.setInterval(() => { if (state.timer) { state.now = Date.now(); renderTimer() } }, 1000)
}

init()
