# Copy audit

Audited 2026-08-28 against the rendered home, empty, demo, dialog, legal, recovery, and README copy. Hyphenated terms count as one word.

## Landing page

| Words | Exact rendered copy | Claim mapping |
| ---: | --- | --- |
| 5 | Work sessions for independent workers | Audience label. |
| 7 | Turn freelance time into a client receipt | Job-led h1. |
| 12 | For independent workers who need to explain billable time without activity tracking. | `no-device-capture` and product purpose. |
| 5 | Try it with sample data | `demo-isolation`. |
| 5 | Opens a sample weekly receipt. | `demo-isolation`. |
| 5 | Records stay in this browser. | `local-privacy`, `session-persistence`. |
| 9 | After your first visit, saved work sessions open offline. | `offline-reload`. |
| 5 | Recording and exports are free. | `free-core`. |
| 8 | A weekly receipt is self-reported, not independent proof. | `self-reported`. |
| 4 | Start a work session | Task heading. |
| 5 | You choose what to record. | `no-device-capture`. |
| 9 | Work sessions and evidence links stay in this browser. | `local-privacy`, `evidence-control`. |
| 3 | Recent work sessions | Section heading. |
| 5 | Add your first work session | Empty-state heading. |
| 9 | Start the timer or add a completed work session. | `session-recording`. |
| 5 | Create a weekly client receipt | Section heading. |
| 12 | Create a weekly PDF that lists outcomes, time, breaks, and selected evidence. | `pdf-receipt`. |
| 7 | Back up or import your work sessions | Section heading. |
| 7 | Download a JSON backup or CSV file. | `json-roundtrip`, `csv-export`. |
| 7 | Import a JSON backup on another device. | `json-roundtrip`. |
| 3 | How it works | Section heading. |
| 4 | Record a work session. | `session-recording`. |
| 9 | Add the outcome, time, break, and optional evidence link. | `session-details`. |
| 3 | Review the week. | Instruction. |
| 8 | Check each self-reported work session before sharing it. | `self-reported`. |
| 3 | Download the receipt. | `pdf-receipt`. |
| 11 | Save a PDF for your client and a backup for yourself. | `pdf-receipt`, `json-roundtrip`. |
| 6 | What Work Receipt does not do | Limitation heading. |
| 10 | It does not request screen, camera, microphone, or location access. | `no-device-capture`. |
| 12 | A weekly receipt records what you enter; it is not independent proof. | `self-reported`. |
| 10 | Work Receipt · self-reported work sessions stored in this browser. | `local-privacy`, `self-reported`. |
| 7 | Original generated still-life artwork · Build 1.2.0 | Provenance and build label. |

## Demo, dialogs, and feedback

| Words | Exact rendered copy | Result |
| ---: | --- | --- |
| 7 | Demo — sample data, nothing is saved | Required sandbox notice. |
| 6 | Changes stay separate from your records. | `demo-isolation`. |
| 2 | Reset demo | Result-naming control. |
| 3 | Start for real | Result-naming control. |
| 8 | Say what changed—not every keystroke. | Field guidance. |
| 10 | Marks the work session clearly; it never reduces billable time. | `session-details`. |
| 4 | No work sessions in this week. | Empty-state heading. |
| 12 | Choose an earlier week or close this preview and add a work session. | Empty-state instruction. |
| 8 | Timer started · it will survive a refresh | `session-recording`. |
| 6 | Work session saved on this device | `session-persistence`. |
| 5 | Receipt identity saved on this device | `receipt-settings`. |

## README

| Words | Exact copy | Claim mapping |
| ---: | --- | --- |
| 10 | Turn freelance work sessions into a private weekly client receipt. | Product job. |
| 10 | For independent hourly workers who need to explain billable time. | Audience. |
| 14 | Use it when review, waiting, and judgment do not show in an activity tracker. | Product situation. |
| 6 | Record timed or manual work sessions. | `session-recording`. |
| 10 | Add outcomes, breaks, optional evidence links, and an AI-assisted label. | `session-details`, `evidence-control`. |
| 10 | Create a weekly PDF that stays clear about being self-reported. | `pdf-receipt`, `self-reported`. |
| 9 | Your records stay in this browser on this device. | `local-privacy`, `session-persistence`. |
| 10 | The app sends no work-session data, analytics, or tracking requests. | `local-privacy`. |
| 9 | Saved work sessions open offline after the first visit. | `offline-reload`. |
| 12 | The demo starts with three work sessions and an open weekly receipt. | `demo-isolation`. |
| 8 | Its database is separate from your real records. | `demo-isolation`. |
| 14 | Use Reset demo to restore the sample or Start for real to discard it. | `demo-isolation`; “restore” refers only to resetting the sample. |
| 8 | A timer and manual entry for work sessions. | `session-recording`. |
| 7 | A self-reported weekly receipt and PDF download. | `pdf-receipt`, `self-reported`. |
| 4 | JSON backup and import. | `json-roundtrip`. |
| 8 | CSV export with one row per work session. | `csv-export`. |
| 6 | Receipt name, client, and closing-note settings. | `receipt-settings`. |
| 11 | Install the app and open saved work sessions offline after one visit. | `installable-pwa`, `offline-reload`. |
| 11 | Recording, receipt details, PDFs, backup, import, and CSV export are free. | `free-core`. |
| 9 | There is no paid tier or embedded payment provider. | `free-core`, `local-privacy`. |
| 10 | Work Receipt does not request screen, camera, microphone, or location access. | `no-device-capture`. |
| 6 | It does not provide independent proof. | `self-reported`. |
| 11 | Evidence links are stored as text and open only when selected. | `evidence-control`. |

## Result

- No sentence exceeds 22 words.
- No copy uses the banned marketing words.
- The first screen names the job, audience, first action, next result, privacy boundary, offline prerequisite, and price.
- Buttons use verbs; recovery headings name the actual state.

## Terminology

| Concept | One term |
| --- | --- |
| Saved timed or manual unit | work session |
| Client-facing weekly PDF | weekly receipt |
| Deducted non-billable duration | break |
| Optional supporting URL | evidence link |
| Bringing in a JSON backup | import |
| User-owned portable copy | JSON backup |
| Isolated sample workspace | demo |
