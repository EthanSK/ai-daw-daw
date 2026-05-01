---
name: humforge
description: Create music sketches from voice notes, humming, singing, beatboxing, metronome requests, and spoken arrangement instructions.
---

# Humforge Skill

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
