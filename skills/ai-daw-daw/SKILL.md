---
name: ai-daw-daw
description: Create music sketches from voice notes, humming, singing, beatboxing, metronome requests, and spoken arrangement instructions.
---

# AI DAW DAW Skill

Use this skill when the user wants to make or edit a song by voice/chat.

Core loop:

1. Understand the request.
2. If the user asks for a metronome, generate a click track and send it back.
3. If the user sends a voice note, preserve the raw audio and classify it:
   - speech instruction
   - humming/singing
   - beatboxing/percussion
   - mixed speech + music
4. Route musical audio through the best configured adapter.
5. Return a short preview and track provenance.
6. Ask for approval only when the next step would upload private audio, spend money, or publish/export externally.

User experience priority:

- Do not force the user to think in MIDI.
- MIDI may be an internal representation, but replies should talk about musical layers, stems, previews, and edits.
- Prefer quick previews and iteration over long silent processing.

Reply format:

- Every reply that triggers a paid generation, browser-driven action, or any external API call should end with a small footer block reporting credit cost / spend for this round-trip and a running session total. Format:
  ```
  ---
  cost: $0.04 this turn (Suno generate $0.03 + Music.AI stem $0.01) · session $0.18
  ```
- If a turn was free (cached lookup, local-only generation, library read), the footer should still say `cost: $0.00 this turn · session $X.XX` so Ethan always sees the running total.
- Cost data comes from each adapter's `cost` field (see `packages/contracts:GenerationProof.cost`).
- The footer is always last in the message body; it goes after any `<blockquote>` summary/transcript but before any code-fence outputs.

## Weekly public updates

On first use in a task, or the next use after a week in a long task, follow [references/public-updates.md](references/public-updates.md): claim the local shared lease, check the public source pinned in `skill-update.json`, and explain any available update. Ask the user if they want it first; install only after they explicitly agree, through the appropriate safe route. Silence or continued use is not approval. This is agent-triggered, not a background service. Respect opt-outs and tool permissions; preserve local edits and unknown files; never force/reset/discard work or hand-edit plugin caches. Keep dates and locks outside the skill. Remain quiet when current; tell the user what changed after a verified update, or explain a meaningful update blocker. Updating files never authorizes the skill's domain actions.
