# Humforge

**Working tagline:** make songs by sending voice notes.

Humforge is an open-source, agent-friendly music creation system where a user can send voice notes — humming, singing, beatboxing, or spoken arrangement ideas — and an agent turns them into layered song sketches.

The goal is not a traditional DAW clone and not a one-shot “make me a finished song” toy. The goal is a creative loop:

1. Ask for a metronome or backing click.
2. Hum/sing/beatbox an idea over Telegram or another chat harness.
3. Let agents route the audio through the best available tools — local models, paid web apps, browser workflows, APIs, or DAW plugins.
4. Layer the results into a project.
5. Iterate by voice: “make it darker”, “try cello”, “double the chorus”, “send stems”.

## Current direction

- **Voice-first:** the user should not have to think in MIDI. MIDI may be an internal bridge, but the product should feel like singing/humming directly into instruments and layers.
- **Agentic tool routing:** support APIs where they exist, but also allow browser-use instructions for paid/trendy tools with no clean API.
- **DAW-as-harness:** investigate whether an open-source DAW or audio engine can become the core harness that agents control.
- **Cross-harness plugin shape:** keep natural-language instructions, manifests, adapters, CLI, tests, and examples separated so the project can work across OpenClaw, Claude Code, local CLI, Telegram bots, and future harnesses.
- **Local-first where possible:** keep private voice notes local by default; cloud tools should be explicit opt-in adapters with provenance.

## Planned features

- Telegram/OpenClaw voice-note ingestion.
- Agent-customizable metronome generation.
  - Default: 2 minutes of plain clicks.
  - User can request BPM, duration, time signature, swing, count-in, accents, and sound type.
- Hummed/sung/beatboxed layer capture.
- Agentic browser-use recipes for modern voice-to-music tools.
- Optional model/API adapters for direct voice-to-instrument or voice-to-song workflows.
- Layer registry with source audio, generated output, prompts/settings, tool provenance, and approval state.
- Preview renders back to chat.
- Exportable stems/project files.
- Open-source DAW/audio-engine integration research.

## Status

Early planning repo. The first deliverable is a practical architecture and research-backed tool map, then a minimal proof of concept: ask for a metronome, record a hum over it, process it through one tool path, and return a layered preview.
