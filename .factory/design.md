# Work Receipt — visual thesis

## Direction: the handwritten lab notebook

Work Receipt should feel like opening a careful field notebook: honest observations, useful timestamps, crossed-paper structure, and a final page ready to hand to a client. It must not resemble a surveillance dashboard or a glossy invoice SaaS. The interface uses a warm ruled-paper ground, ink-dark type, pencilled metadata, and restrained stamp-like accents. The metaphor fits the product because every session is a deliberate, self-reported field note—not an automated claim of proof.

The treatment is deliberately single-mode. A warm, low-glare paper surface is part of the artifact's identity and is explicitly painted throughout the app and generated PDF. This also keeps a client-facing receipt visually stable between screen, print, and offline use.

## Tokens

Palette (all text pairings meet WCAG AA):

- `paper #F4EEDC` — page background, derived from an aged but clean notebook sheet.
- `sheet #FFFDF6` — raised writing surface.
- `ink #172321` — blue-black fountain pen; primary text (14.0:1 on sheet).
- `graphite #4B5752` — annotations and secondary text (7.2:1 on sheet).
- `rule #C7D1C6` — notebook rules and quiet dividers.
- `teal #176B64` — oxidised instrument enamel; actions and links (5.7:1 on sheet).
- `teal-dark #0D4F4A` — hover/pressed action.
- `stamp #A33A2B` — vermilion validation stamp and destructive emphasis (6.7:1 on sheet).
- `success #25613B`, `warning #7A4B00`, `danger #8F2F28` — explicit status colors, always paired with words/icons.

Typography uses two locally available system roles to avoid network fonts and keep the first load small: **Georgia** for notebook headings and receipt titles, and the **ui-monospace** platform stack for dates, durations, totals, and annotations. Body copy uses the readable native sans stack. Tabular numbers are mandatory for time and money-like totals.

Type scale: 16px body, 18px lead, 20px section title, 28px display, 40–48px product title. Line height is 1.55 for prose. Measures stop at 70 characters.

Spacing follows a 4/8px rhythm: 4, 8, 12, 16, 24, 32, 48, 64. Large space divides notebook “chapters”; rules and proximity divide content within them. Corners are mostly 2–10px, like paper and labels rather than bubbly cards.

## Layout and interaction grammar

The app is a two-column workbench at large sizes: a compact left rail for the live timer and project context, and a broad chronological notebook page for entries. At 390px it becomes a single writing surface; actions remain in document flow and no fixed bar obscures content. The weekly receipt preview is a separate print-sheet layer, not another dashboard.

Primary actions look like filled enamel labels. Secondary actions resemble underlined ink notes. Inputs have an explicit top label and a ruled-paper baseline. Every saved session appears immediately as a dated notebook entry with a clear “Self-reported” marker. Evidence is always optional, individually editable, and never fetched or inspected.

Feedback is literal and immediate: the running timer gains a pulsing recording dot, local saves produce a brief stamped confirmation, offline state appears as a small “Offline · saving on this device” label, and destructive actions name the target and require confirmation. Keyboard focus is a double ink-and-paper outline.

## Motion

Motion is short (160–240ms) and physical: new notes settle upward by 4px, dialogs scale from their triggering surface, and stamps appear with a small rotation. Only transforms and opacity animate. The timer recording dot is the sole repeating motion. Under `prefers-reduced-motion: reduce`, all movement and repeating animation stop; state changes remain visible through text and color.

## Asset plan and art direction

The hero illustration is an original still life of a working notebook, watch, paperclip, and small AI “spark” annotation. It explains the product's humane record-keeping without implying automated monitoring. It will be generated as a raster source, reviewed, cropped responsively, and shipped as WebP under 300 KB. Product icons and receipt marks are hand-authored SVG/CSS line work.

Prompt sheet:

- Subject: overhead editorial still life, open field notebook with abstract timeline marks, mechanical stopwatch, fountain pen, paperclip, tiny geometric spark symbol; no readable writing.
- World/materials: warm cotton paper, graphite, fountain-pen ink, oxidised teal enamel, vermilion rubber stamp.
- Light/lens: soft north-window light, natural shadows, overhead 50mm editorial product photography, subtle paper grain.
- Palette words: warm oat paper, blue-black ink, muted teal, oxidised brass, restrained vermilion.
- Negative list: no people, hands, screens, logos, brands, legible text, watermark, surveillance imagery, photorealistic receipts, gradients, plastic 3D icons.

Generation prompt: “Overhead editorial still life of an open handwritten field notebook with abstract non-legible timeline strokes and checkmarks, a compact mechanical stopwatch, fountain pen, paperclip and a tiny geometric four-point spark token suggesting AI assistance; warm cotton paper, graphite and blue-black ink, oxidised teal enamel, aged brass, restrained vermilion rubber-stamp mark; soft north-window light, natural shadows, 50mm product photography, tactile subtle paper grain, calm precise composition with generous negative space on the left, no people, no hands, no screens, no readable text, no numbers, no logos, no brands, no watermark, no surveillance imagery, no gradients, no plastic 3D icons.”

## Provenance

The hero asset is generated specifically for Work Receipt using the factory Azure OpenAI image deployment (`factory-image`) on 2026-08-28. The exact prompt and generation parameters live alongside the source asset in `assets/src/hero-notebook.json`. Generated imagery is disclosed in the product footer. Hand-authored interface marks are MIT-licensed with the repository.
