# Humforge Plan

> Working name: **Humforge**. Final name is still TBD.

## Current phase

Planning only. Do not build the actual product implementation until Ethan explicitly says to start building. The current repo exists to plan the system properly so it can actually be made later.

## Vision

Humforge is a voice-first, agent-driven music creation system.

The user should be able to talk, hum, sing, beatbox, or ask for a metronome in chat. The system should then route that audio through the best available music tools — local engines, browser-based paid tools, APIs, DAWs, plugins, or agent workflows — and layer the results into a song project.

The product should feel like:

1. “Send me a two-minute metronome at 128 BPM.”
2. The agent sends a click track.
3. The user hums/sings/beatboxes over it.
4. Agents transform that voice note into musical layers.
5. The user iterates by voice: “make it darker”, “add a chorus”, “try guitar”, “send stems”.

## Important correction

The project should not feel MIDI-first to the user.

MIDI may still be useful internally, but the user experience should be: **I sing or hum; agents use whatever modern tools work best; the song gains layers.**

Research should therefore include new/trendy AI music tools even when they are paid, browser-only, or not token/API-based. If a good tool only works through a web app, Humforge can include agentic browser-use instructions for it.

## Core features

### Metronome

- User can ask for a metronome by voice or text.
- Default output: 2 minutes of plain click track.
- Customizable:
  - BPM
  - duration
  - time signature
  - count-in
  - accents
  - swing
  - click sound
  - subdivision
- The metronome is sent back as an audio file in chat.
- Later voice-note layers can be aligned against that metronome.

### Voice-note layer capture

- Accept humming, singing, beatboxing, and spoken instructions.
- Store raw source audio locally.
- Split speech vs musical audio when possible.
- Route musical segments through chosen tools.
- Track every generated layer with provenance:
  - source audio
  - tool/model/provider
  - prompt/settings
  - output file
  - approval state
  - license/commercial-use notes where known

### Agentic tool routing

- Prefer APIs/CLIs when available.
- Support browser-use recipes for tools with no API.
- Keep adapters modular so paid/trendy tools can be swapped in/out.
- Do not silently upload private voice notes to cloud tools; make cloud routes explicit.

### DAW / harness direction

Investigate whether Humforge should use an open-source DAW/audio engine as its “harness”.

The ideal DAW/codebase would be:

- actively maintained
- easy to extend with code
- scriptable or embeddable
- able to arrange clips/layers/stems
- able to render/export audio
- friendly to agent-driven control
- legally compatible with an open-source project

## Cross-harness plugin/app shape

Humforge should be structured as a hybrid of text and code:

- manifests for harness discovery
- skill/instruction docs for agents
- code adapters for actual work
- CLI/API for non-agent automation
- examples and fixtures
- tests and evaluation harness
- provider/browser recipes for external tools

Target harnesses may include:

- OpenClaw
- Claude Code skills
- local CLI
- Telegram bot
- future agent harnesses
- DAW-side plugin or scripting host

## Proposed repo skeleton

```txt
humforge/
  README.md
  PLAN.md
  .env.example
  package.json / pyproject.toml

  skills/
    humforge/SKILL.md

  apps/
    telegram-bot/
    openclaw-adapter/
    worker/
    web-viewer/

  packages/
    core/              # project model, layer registry, provenance, timeline
    audio/             # metronome, normalization, alignment, renders
    adapters/          # API/CLI/browser/model adapters
    daw/               # DAW integration layer
    harness/           # CrossHarness manifests and routing
    cli/               # local commands

  recipes/
    browser-tools/     # agentic browser-use instructions for web tools
    providers/         # provider-specific setup notes

  examples/
    demo-project/
    fixtures/

  docs/
    architecture.md
    metronome.md
    adapters.md
    daw-research.md
    provenance.md
    crossharness.md

  tests/
    fixtures/
    integration/
```

## Current research tasks

- Research new/trendy AI tools for direct humming/singing/voice-to-instrument/song/layer workflows, including paid or browser-only tools.
- Research open-source DAWs/audio engines to find the best codebase to extend or control as the Humforge harness.
- Compare Ethan’s existing repos for the best CrossHarness-compatible plugin/app/skill structure.

## Name

Working name is **Humforge**. Final name is pending.
