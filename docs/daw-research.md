# Open-Source DAW / Audio Harness Research

AI DAW DAW is a voice-first, agent-driven music creation system in planning. The "harness" question is whether to extend an existing open-source DAW or build on a lower-level audio engine. This report evaluates 10 candidates against AI DAW DAW's hard requirements: cross-platform (macOS + Linux required, Windows bonus), open-source-compatible licensing, active 2025–2026 maintenance, real timeline/clip/multi-track model, plugin hosting, render-to-file, and an external-control surface (scripting, OSC, RPC, IPC, or library embedding).

## Evaluation criteria
- License + implications for AI DAW DAW (copyleft contagion risk)
- Maintenance status (last release, commit cadence in 2025–2026)
- Build complexity on macOS + Linux
- Scripting / automation / IPC surface (Lua, Python, OSC, gRPC, file-control)
- Plugin hosting (VST3/AU/LV2/CLAP)
- Clip / timeline model strength
- Headless / agent-control friendliness
- Render-to-file support

## Candidates

### Ardour
- **License:** GPLv2 (per ardour.org/development.html). Project explicitly refuses LLM-generated contributions ("no LLM-generated code may be copyrighted in the USA"). GPL contagion: any AI DAW DAW code linking Ardour internals must be GPL-compatible. ([Ardour dev page](https://ardour.org/development.html))
- **Maintenance (2026):** Active. Robin Gareus gave a Lua-scripting talk at LAC 2025; Ardour 8.x is current line. ~43k commits on master. ([LAC2025 talk](https://www.youtube.com/watch?v=Seg5rbvF1C8))
- **Mac/Linux build:** ~1M LOC C++/gtkmm. Both supported officially; see Ardour's "Building Ardour on Linux" / "Building Ardour on OS X" guides. Heavy dep tree (gtkmm, boost, JACK, etc.).
- **Scripting / IPC:** Best-in-class for an open DAW — embedded Lua, full OSC server, and Lua bindings can send/receive OSC. Hook scripts (`_osc_hook_example.lua`) shipped in tree. ([Ardour Lua manual](https://manual.ardour.org/lua-scripting/), [class reference](https://manual.ardour.org/lua-scripting/class_reference/))
- **Plugin hosting:** LV2, VST2, VST3, AU (Mac).
- **Clip/timeline model:** Full multi-track timeline, regions, clips, takes, comping. Mature.
- **Agent-control friendliness:** Strong via Lua + OSC, but Ardour is GUI-first; headless operation requires extra plumbing.
- **Render/export:** Full export including stem export, freewheel offline rendering.
- **AI DAW DAW fit:** **5/5** — by far the most agent-friendly full DAW; the LLM-code policy means we can't upstream agent-generated code to Ardour, but a downstream fork or Lua-script layer is fine.

### Zrythm
- **License:** AGPL-3.0 (GitHub repo badge). AGPL contagion is stronger than GPL — any network service exposing Zrythm-derived code must release source. ([zrythm/zrythm](https://github.com/zrythm/zrythm))
- **Maintenance (2026):** Active. v1.0.0 released 2024-11-21; v2 alpha in progress on master. ([zrythm.org](https://www.zrythm.org/en/index.html))
- **Mac/Linux build:** Officially supports macOS, Linux, Windows. C++23 with Qt/QML + JUCE. Build is non-trivial.
- **Scripting / IPC:** No documented Lua/Python embed; "device-bindable parameters for external control." Weaker than Ardour for agent control as of 2026.
- **Plugin hosting:** LV2, CLAP, VST2, VST3, AU, LADSPA, DSSI; SFZ/SF2.
- **Clip/timeline model:** Modern timeline + chord/scale tooling.
- **Agent-control friendliness:** Limited until scripting matures.
- **Render/export:** Yes.
- **AI DAW DAW fit:** **3/5** — modern, but AGPL + thin scripting surface make it less agent-friendly than Ardour.

### LMMS
- **License:** GPL-2.0-or-later. ([LMMS GitHub](https://github.com/LMMS/lmms))
- **Maintenance (2026):** Active — monthly progress reports, ~13–17 PRs/month merged through late 2025. ([LMMS Progress Report July 2025](https://lmms.io/forum/viewtopic.php?t=37644))
- **Mac/Linux build:** Cross-platform (Mac/Linux/Windows) via CMake.
- **Scripting / IPC:** No embedded scripting language; project file is XML.
- **Plugin hosting:** VST2 (limited VST3), LADSPA, LV2.
- **Clip/timeline model:** Pattern/beat-bassline + Song Editor — weaker for free-form voice-clip layering than Ardour/Tracktion.
- **Agent-control friendliness:** Low — would mean writing XML project files and rendering via CLI.
- **Render/export:** Yes (CLI render supported).
- **AI DAW DAW fit:** **2/5** — mismatch with voice-clip, free-timeline workflow.

### Bespoke Synth
- **License:** GPLv3. ([awwbees/BespokeSynth](https://github.com/awwbees/BespokeSynth))
- **Maintenance (2026):** Active, nightly builds.
- **Mac/Linux/Windows:** All three supported.
- **Scripting / IPC:** **Python livecoding built-in**, OSC and MIDI mapping.
- **Plugin hosting:** VST, VST3, LV2.
- **Clip/timeline model:** **Modular live-patch environment, not a clip timeline.** No song-arrangement model in the DAW sense.
- **Agent-control friendliness:** Python is great for agents, but no timeline = wrong shape.
- **Render/export:** Audio export, but live-performance-oriented.
- **AI DAW DAW fit:** **2/5** — wrong primitive (modular patcher, not arrangement DAW).

### Audacity / Tenacity
- **License:** Audacity GPLv2; Tenacity GPLv2/v3 fork (verify at github.com/tenacityteam/tenacity LICENSE).
- **Notes:** Editor, not a clip-timeline multi-track DAW with plugin-host arrangement. Tenacity exists because of Audacity's Muse Group telemetry controversy.
- **AI DAW DAW fit:** **1/5** — recommend against. Reference only.

### Tracktion Engine
- **License:** **GPLv3 / commercial dual-license**, plus separate JUCE license requirement. ([Tracktion/tracktion_engine](https://github.com/Tracktion/tracktion_engine))
- **Maintenance (2026):** Active — v3.2.0 released 2025-05-15, ~2k commits on develop.
- **Mac/Linux build:** macOS, Windows, Linux, iOS, Android, RPi. C++20 + JUCE; CMake.
- **Scripting / IPC:** No built-in scripting — it's a **library**. You write the host. `EngineInPluginDemo` shows hosting flow.
- **Plugin hosting:** Inherits JUCE: VST3, AU, LV2 (recent JUCE), CLAP via wrappers.
- **Clip/timeline model:** **Full Edit/Track/Clip model** — production-grade DAW data model designed for embedding.
- **Agent-control friendliness:** Highest — agents write C++/JSON that drives the engine; no GUI to scrape; headless render natively.
- **Render/export:** First-class offline render.
- **AI DAW DAW fit:** **5/5** — best fit if AI DAW DAW is willing to be a *new* app rather than an extension. Caveat: GPLv3 unless commercial license is purchased; JUCE license fees apply for closed-source distribution but JUCE is free for GPL projects.

### Carla
- **License:** GPLv2+. ([falkTX/Carla](https://github.com/falkTX/Carla))
- **Maintenance (2026):** v2.5.10 released 2025-07-31. Active.
- **Mac/Linux/Windows:** All supported.
- **Scripting / IPC:** **OSC remote control**, Python components.
- **Plugin hosting:** LADSPA, DSSI, LV2, VST2, VST3, AU; SF2/SF3/SFZ.
- **Clip/timeline model:** **None** — Carla is a plugin host/router, not a DAW.
- **Render/export:** Limited (audio file player + plugin chain).
- **AI DAW DAW fit:** **2/5 standalone, 4/5 as backend** — pair with Ardour or a custom layer for plugin-hosting.

### REAPER
- **License:** **Commercial paid** (~$60 discounted / $225 commercial). DRM-free, but **not redistributable**. ReaScript = Lua/Python/EEL. ([reaper.fm](https://www.reaper.fm/))
- **Maintenance (2026):** Very active.
- **Mac/Linux/Windows:** All three supported (Linux native).
- **Scripting / IPC:** **Best-in-class**: ReaScript (Lua, Python, EEL), OSC, web remote, ReaPack ecosystem.
- **Plugin hosting:** Everything (VST2/3, AU, CLAP, LV2, JSFX).
- **Clip/timeline model:** Industry-standard.
- **Agent-control friendliness:** Excellent via ReaScript.
- **Render/export:** Excellent CLI + scripted render.
- **AI DAW DAW fit:** **N/A as harness for an open-source project** — cannot ship REAPER inside AI DAW DAW. Useful as a **practical baseline** AI DAW DAW users may already own. Verify license terms at reaper.fm/license.php.

### JUCE
- **License:** Dual GPLv3 / commercial (verify at github.com/juce-framework/JUCE LICENSE.md). Latest 8.0.12 (2025-12-16). ([JUCE](https://github.com/juce-framework/JUCE))
- **What it gives you:** Plugin hosting, audio I/O, GUI, format wrappers — **no DAW timeline model.** That's what Tracktion Engine adds on top.
- **AI DAW DAW fit:** **3/5** — too low-level alone; pick Tracktion Engine instead.

### Sushi (Elk Audio)
- **License:** AGPLv3 (per LICENSE.md / COPYING — verify). ([elk-audio/sushi](https://github.com/elk-audio/sushi))
- **Maintenance (2026):** v1.3.0 released 2026-03-30. Active.
- **Mac/Linux/Windows:** All three.
- **Scripting / IPC:** **gRPC external control** + config-file driven. Headless by design.
- **Plugin hosting:** VST2, VST3, LV2.
- **Clip/timeline model:** **Limited** — sequencer/synth-host orientation, not a clip arrangement DAW.
- **Render/export:** Supported.
- **AI DAW DAW fit:** **3/5** — strong headless+gRPC story but missing arrangement model. AGPL is stricter than GPL.

## Decision matrix (top 5)

| DAW/engine | License risk | Build complexity | Scripting depth | Best AI DAW DAW use |
| ---- | ---- | ---- | ---- | ---- |
| Tracktion Engine | Medium (GPLv3 or pay; JUCE too) | Medium (CMake, JUCE) | Library — you build IPC | **Build AI DAW DAW as a new app on top** |
| Ardour | Medium-High (GPLv2 contagion, no-LLM rule) | High (gtkmm + 1M LOC) | Excellent (Lua + OSC) | Extend with Lua + OSC, fork-friendly |
| Zrythm | High (AGPL) | Medium | Thin | Watch v2; not yet ready |
| Bespoke Synth | Medium (GPLv3) | Low-Medium | Good (Python live) | Sound-design sandbox, not arrangement |
| Sushi | High (AGPL) | Medium | Good (gRPC) | Headless render farm component |

## Recommendation

- **Primary: Tracktion Engine** — for building AI DAW DAW as a *new* C++/JUCE app where agents drive an Edit/Track/Clip model headlessly. GPLv3 is acceptable for an open-source AI DAW DAW; commercial dual-license is available if needed later. Best timeline model for agent code-generation, native render-to-file, no GUI to fight.
- **Fallback: Ardour** — for shipping AI DAW DAW as a *layer on top of an existing DAW*. Lua + OSC are mature, the timeline is battle-tested, and macOS/Linux are first-class. Accept GPLv2 and the no-LLM contribution policy (means we keep agent-generated code in our repo, not upstream).
- **Practical baseline (closed): REAPER** — for users who already own it. ReaScript (Lua/Python) + OSC give the richest agent-control surface anywhere. We can ship a REAPER-extension flavor of AI DAW DAW as an optional path, but cannot redistribute REAPER itself.

## Web / Electron / agent-first DAWs

The previous section converged on Tracktion Engine (primary) and Ardour (fallback) under a "native C++ DAW driven by an out-of-process MCP" assumption. This section re-evaluates that under a different lens: if the agent fully drives the DAW, a JavaScript/TypeScript runtime that the agent can speak to via DOM, IPC, or a documented protocol may be a *much* shorter path than reverse-engineering OSC/headless wrappers around a C++ engine. As of 2026 the landscape has changed materially — Audiotool's NEXUS API (Jan 2026) and openDAW's headless SDK both ship the kind of full project-graph surface that agent-driven music workflows need.

### Candidates

#### openDAW (andremichelle)
- **License + maintenance:** AGPL-3.0 with commercial alternative; very active in 2025–2026, 1.0 GA targeted Q3 2026, ~2,900 commits on main ([github.com/andremichelle/openDAW](https://github.com/andremichelle/openDAW)).
- **Architecture:** Pure web (TypeScript ~96 %, Sass), Web Audio API, minimal deps (jszip, ffmpeg.wasm, soundfont2, zod). Tauri desktop wrapper on the roadmap. No React/Vue — custom DOM/Sass.
- **Agent-control surface:** A separate `opendaw-headless` SDK template repo exists ([github.com/andremichelle/opendaw-headless](https://github.com/andremichelle/opendaw-headless)) that boots the DAW engine as a library; programmatic project edits are possible but the public API surface is thinly documented. No first-party MCP server. DOM/CDP automation is feasible because it's a normal SPA. A "Preset API" is on the 2025-Q4 roadmap.
- **Plugin / Web Audio:** 18 stock instruments/effects + one ported third-party compressor. No VST/WAM hosting documented. TONE3000 integration announced.
- **Clip/timeline:** Full multi-track timeline, mixer, automation, MIDI editor — feature-parity with mid-tier native DAWs is the explicit target.
- **Render:** Not explicitly documented in headless template; ffmpeg.wasm is bundled so offline render is technically reachable.
- **Mac/Linux/Win:** Browser-universal; Tauri wrapper would inherit Mac/Linux/Win. Dev requires Node ≥23 + mkcert.
- **AI DAW DAW fit:** **4/5** — closest existing match to "open-source web DAW you could plausibly drive end-to-end." Risk is the SDK being a moving target before 1.0.

#### Audiotool Studio + NEXUS
- **License + maintenance:** Studio host is **closed-source / freemium SaaS**; NEXUS SDK examples repo is **MIT** ([github.com/audiotool/nexus-sdk-examples](https://github.com/audiotool/nexus-sdk-examples)). Open beta launched January 2026 ([musically.com](https://musically.com/2026/02/10/open-beta-launches-for-redesigned-audiotool-studio-daw/)).
- **Architecture:** Multiplayer cloud DAW (browser), Web Audio + WAM under the hood. NEXUS is a **Protocol Buffers**-defined API covering every DAW entity (devices, cables, patterns, automation, MIDI, plugin state). SDK ships for browser, Node, Bun, Deno, and any protobuf language (Python/Go/Rust).
- **Agent-control surface:** *Best-in-class for an agent.* `@audiotool/nexus` connects to a live multiplayer session and reads/writes the project graph in real time — exactly the shape an LLM agent wants ([developer.audiotool.com](https://developer.audiotool.com/)). Effectively LSP-for-audio.
- **Plugin / Web Audio:** Native devices + WAM hosting; partner integrations (Spitfire, Fraunhofer, DAACI).
- **Clip/timeline:** Full DAW timeline, automation, mixer.
- **Render:** Cloud-side render; not self-hostable.
- **Mac/Linux/Win:** Browser-universal, but **the host is not open-source and not self-hostable** — AI DAW DAW would be a NEXUS *client*, not a fork.
- **AI DAW DAW fit:** **3/5** — by far the cleanest API, but the host runs on Audiotool's servers and is closed. Dependency, not building block.

#### DAWG ([github.com/dawg/dawg](https://github.com/dawg/dawg))
- **License:** MIT. **Maintenance:** dormant (last release v0.2.3, March 2020).
- **Architecture:** Electron + Vue + TypeScript + Web Audio.
- **Agent surface:** None documented; Electron renderer means CDP automation is trivially possible but you'd be driving an unmaintained UI.
- **AI DAW DAW fit:** **2/5** — useful as a reference for how a Vue/Electron DAW lays out, not a base to fork.

#### Wavtool, BandLab, Soundation, Soundtrap, AmpedStudio
- All **closed-source** SaaS browser DAWs. Wavtool (the GPT-4 Conductor pioneer) shut down Nov 2024 and was apparently acquired ([audiocipher.com](https://www.audiocipher.com/post/ai-daw)). AmpedStudio uses open-source WAM internally but the host is proprietary. **Reference only**, not eligible building blocks.

#### GridSound, pverrecchia/OpenDAW, node-daw, FL Studio Electron clones
- Hobby/student-grade open-source web/Electron DAWs. Active to varying degrees but none expose an agent-control surface, none have meaningful plugin ecosystems, and none rival andremichelle/openDAW's depth. **AI DAW DAW fit: 1/5.**

#### Existing DAW MCP servers (orthogonal but relevant)
- `ahujasid/AbletonMCP`, `ptaczek/daw-mcp` (Bitwig + Live), `s2d01/daw-midi-generator-mcp`, `DAW Connect` (29 tools, macOS) — all 2025–2026, all driving **closed-source native DAWs**. Confirm the agent-controls-DAW pattern is real and shippable, but inherit Live/Bitwig licensing constraints.

### Building blocks (not full DAWs)
- **Tone.js** — Transport/Sequence/Part scheduling on top of Web Audio; the de-facto JS music timing layer.
- **WaveSurfer.js** — waveform UI + region/clip primitives.
- **Web Audio Modules 2.0 (WAM)** — open plugin standard ([webaudiomodules.com](https://www.webaudiomodules.com/docs/intro/)); WAM hosts can load any WAM by URI. Supported by Audiotool, AmpedStudio, and increasingly openDAW-adjacent tooling.
- **Faust / FaustIDE** — DSP-language → Web Audio / WAM / native; strong for agent-generated custom instruments.
- **Tonal.js** — music-theory primitives the agent uses to *reason*, not render.
- **ffmpeg.wasm** — render-to-file from the browser without a server.

### Decision matrix (top 3)
- **openDAW** — License: AGPL-3 / commercial. Architecture: Web (TS, Web Audio), Tauri planned. Agent-control depth: medium (headless SDK exists, public API thin pre-1.0). Best AI DAW DAW use: fork or embed as the renderer, build the MCP layer ourselves.
- **Audiotool NEXUS** — License: MIT SDK / closed host. Architecture: cloud-only browser DAW, protobuf API. Agent-control depth: high (full project graph, every entity, multi-language SDKs). Best AI DAW DAW use: ship AI DAW DAW-as-a-NEXUS-client for fastest time-to-demo; cannot self-host.
- **Tone.js + WaveSurfer + WAM + ffmpeg.wasm** — License: MIT all round. Architecture: build-your-own. Agent-control depth: total (we design the API). Best AI DAW DAW use: greenfield AI DAW DAW-shaped renderer where the "DAW" is whatever the agent's data model says it is.

### Recommendation (web/Electron lens)
- **Primary:** **openDAW** — only AGPL/commercial open-source web DAW with real depth, an explicit headless SDK, and 2026-active development. AI DAW DAW wraps it in Electron/Tauri, layers a AI DAW DAW-specific MCP server over the headless SDK, and contributes upstream where the API is thin.
- **Fallback (fastest demo):** **Audiotool NEXUS as a client integration** — if AI DAW DAW's value prop tolerates a SaaS dependency, the NEXUS protobuf surface is the most agent-ready DAW API in existence today. Ship a AI DAW DAW agent that drives a NEXUS session, validate the UX, then port to a self-hosted stack.
- **Build-from-blocks option:** **Tone.js + WaveSurfer + WAM + ffmpeg.wasm + custom React/Svelte shell.** Pick this if openDAW's pace or AGPL implications block product moves, or if AI DAW DAW's data model diverges enough from "tracks/clips/automation" that adapting an existing DAW costs more than building.

### How this re-prioritizes the overall recommendation
This *adds a parallel track* rather than replacing Tracktion Engine + Ardour. The native track wins on audio quality, plugin ecosystem (VST3/AU/CLAP), and offline robustness; the web track wins on agent-control ergonomics and ship speed for a voice-first agent demo. A pragmatic plan is **openDAW (or Tone.js-stack) for the agent-first prototype + voice demo, Tracktion Engine for the eventual "pro" backend**, sharing a common project format (probably MIDI + a AI DAW DAW JSON envelope) so the agent's mental model is portable. The closed-source Wavtool/Soundtrap/BandLab/AmpedStudio/Soundation references confirm the market shape but contribute nothing forkable.

### Web/Electron-specific open questions
- Does openDAW's headless SDK expose **transport, render-to-WAV, MIDI import/export, automation write** through documented TS APIs, or only through the GUI today? (Read `opendaw-headless` source + `naomiaro/opendaw-test`.)
- AGPL §13 implications for AI DAW DAW-as-hosted-SaaS — is the commercial license required, and at what cost?
- NEXUS auth model — API key, OAuth, or session-token? Rate limits? Can a single AI DAW DAW agent run an unattended session?
- Can openDAW host **WAM** plugins today, or only its 18 stock devices? (The WAM standard is open and adopted by Audiotool/AmpedStudio; openDAW's plugin model is unclear.)
- Tauri vs. Electron for the desktop wrapper — Tauri is on openDAW's roadmap; does AI DAW DAW prefer Tauri (smaller, Rust-core) or Electron (CDP automation is dead-simple)?
- Render-to-file path: ffmpeg.wasm in-browser vs. spawning a headless openDAW Node process vs. offline `OfflineAudioContext`?
- Are there any **2026 MCP-for-Web-Audio efforts** beyond the Live/Bitwig MCP servers — i.e., would AI DAW DAW's MCP server be the first agent surface for an open-source web DAW? (Likely yes — opportunity.)

## Open questions / things to verify before building
- Verify Tracktion Engine GPL terms vs. JUCE's separate license at github.com/Tracktion/tracktion_engine/blob/master/LICENSE.md and juce.com/legal — confirm GPL-only AI DAW DAW can ship without paid JUCE seat.
- Confirm Ardour contribution policy specifics if we ever want patches upstream (LLM-code rule per ardour.org/development.html).
- Test Ardour headless / freewheel render reliability on macOS arm64 in 2026.
- Benchmark Tracktion Engine `EngineInPluginDemo` and `DemoRunner` to confirm offline render perf for voice-stem layering.
- Confirm Zrythm v2 stable date — if it ships with a Lua/Python scripting surface, re-rank.
- Decide AI DAW DAW's own license: GPLv3 (compatible with Tracktion Engine GPL path) vs. permissive (would force commercial Tracktion + JUCE seats).
- Evaluate CLAP plugin coverage on each — AI DAW DAW agents will likely prefer CLAP for its modern, scriptable semantics.
- Prototype: drive Ardour via OSC from a Python harness; drive Tracktion Engine via a small CLI shim. Compare loops-per-minute on a "lay 8 voice clips on a timeline and render WAV" task.

## Sources
- [Ardour development page](https://ardour.org/development.html)
- [Ardour GitHub](https://github.com/Ardour/ardour)
- [Ardour Lua Manual](https://manual.ardour.org/lua-scripting/)
- [Ardour Lua Class Reference](https://manual.ardour.org/lua-scripting/class_reference/)
- [Ardour OSC hook example](https://github.com/Ardour/ardour/blob/master/share/scripts/_osc_hook_example.lua)
- [Robin Gareus — Lua Scripting in Ardour, LAC 2025](https://www.youtube.com/watch?v=Seg5rbvF1C8)
- [Zrythm site](https://www.zrythm.org/en/index.html)
- [Zrythm GitHub](https://github.com/zrythm/zrythm)
- [LMMS GitHub](https://github.com/LMMS/lmms)
- [LMMS Progress Report July 2025](https://lmms.io/forum/viewtopic.php?t=37644)
- [Bespoke Synth GitHub](https://github.com/awwbees/BespokeSynth)
- [Tracktion Engine GitHub](https://github.com/Tracktion/tracktion_engine)
- [Carla GitHub](https://github.com/falkTX/Carla)
- [Sushi GitHub](https://github.com/elk-audio/sushi)
- [JUCE GitHub](https://github.com/juce-framework/JUCE)
- [REAPER](https://www.reaper.fm/)
