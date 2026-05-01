# Open-Source DAW / Audio Harness Research

Humforge is a voice-first, agent-driven music creation system in planning. The "harness" question is whether to extend an existing open-source DAW or build on a lower-level audio engine. This report evaluates 10 candidates against Humforge's hard requirements: cross-platform (macOS + Linux required, Windows bonus), open-source-compatible licensing, active 2025–2026 maintenance, real timeline/clip/multi-track model, plugin hosting, render-to-file, and an external-control surface (scripting, OSC, RPC, IPC, or library embedding).

## Evaluation criteria
- License + implications for Humforge (copyleft contagion risk)
- Maintenance status (last release, commit cadence in 2025–2026)
- Build complexity on macOS + Linux
- Scripting / automation / IPC surface (Lua, Python, OSC, gRPC, file-control)
- Plugin hosting (VST3/AU/LV2/CLAP)
- Clip / timeline model strength
- Headless / agent-control friendliness
- Render-to-file support

## Candidates

### Ardour
- **License:** GPLv2 (per ardour.org/development.html). Project explicitly refuses LLM-generated contributions ("no LLM-generated code may be copyrighted in the USA"). GPL contagion: any Humforge code linking Ardour internals must be GPL-compatible. ([Ardour dev page](https://ardour.org/development.html))
- **Maintenance (2026):** Active. Robin Gareus gave a Lua-scripting talk at LAC 2025; Ardour 8.x is current line. ~43k commits on master. ([LAC2025 talk](https://www.youtube.com/watch?v=Seg5rbvF1C8))
- **Mac/Linux build:** ~1M LOC C++/gtkmm. Both supported officially; see Ardour's "Building Ardour on Linux" / "Building Ardour on OS X" guides. Heavy dep tree (gtkmm, boost, JACK, etc.).
- **Scripting / IPC:** Best-in-class for an open DAW — embedded Lua, full OSC server, and Lua bindings can send/receive OSC. Hook scripts (`_osc_hook_example.lua`) shipped in tree. ([Ardour Lua manual](https://manual.ardour.org/lua-scripting/), [class reference](https://manual.ardour.org/lua-scripting/class_reference/))
- **Plugin hosting:** LV2, VST2, VST3, AU (Mac).
- **Clip/timeline model:** Full multi-track timeline, regions, clips, takes, comping. Mature.
- **Agent-control friendliness:** Strong via Lua + OSC, but Ardour is GUI-first; headless operation requires extra plumbing.
- **Render/export:** Full export including stem export, freewheel offline rendering.
- **Humforge fit:** **5/5** — by far the most agent-friendly full DAW; the LLM-code policy means we can't upstream agent-generated code to Ardour, but a downstream fork or Lua-script layer is fine.

### Zrythm
- **License:** AGPL-3.0 (GitHub repo badge). AGPL contagion is stronger than GPL — any network service exposing Zrythm-derived code must release source. ([zrythm/zrythm](https://github.com/zrythm/zrythm))
- **Maintenance (2026):** Active. v1.0.0 released 2024-11-21; v2 alpha in progress on master. ([zrythm.org](https://www.zrythm.org/en/index.html))
- **Mac/Linux build:** Officially supports macOS, Linux, Windows. C++23 with Qt/QML + JUCE. Build is non-trivial.
- **Scripting / IPC:** No documented Lua/Python embed; "device-bindable parameters for external control." Weaker than Ardour for agent control as of 2026.
- **Plugin hosting:** LV2, CLAP, VST2, VST3, AU, LADSPA, DSSI; SFZ/SF2.
- **Clip/timeline model:** Modern timeline + chord/scale tooling.
- **Agent-control friendliness:** Limited until scripting matures.
- **Render/export:** Yes.
- **Humforge fit:** **3/5** — modern, but AGPL + thin scripting surface make it less agent-friendly than Ardour.

### LMMS
- **License:** GPL-2.0-or-later. ([LMMS GitHub](https://github.com/LMMS/lmms))
- **Maintenance (2026):** Active — monthly progress reports, ~13–17 PRs/month merged through late 2025. ([LMMS Progress Report July 2025](https://lmms.io/forum/viewtopic.php?t=37644))
- **Mac/Linux build:** Cross-platform (Mac/Linux/Windows) via CMake.
- **Scripting / IPC:** No embedded scripting language; project file is XML.
- **Plugin hosting:** VST2 (limited VST3), LADSPA, LV2.
- **Clip/timeline model:** Pattern/beat-bassline + Song Editor — weaker for free-form voice-clip layering than Ardour/Tracktion.
- **Agent-control friendliness:** Low — would mean writing XML project files and rendering via CLI.
- **Render/export:** Yes (CLI render supported).
- **Humforge fit:** **2/5** — mismatch with voice-clip, free-timeline workflow.

### Bespoke Synth
- **License:** GPLv3. ([awwbees/BespokeSynth](https://github.com/awwbees/BespokeSynth))
- **Maintenance (2026):** Active, nightly builds.
- **Mac/Linux/Windows:** All three supported.
- **Scripting / IPC:** **Python livecoding built-in**, OSC and MIDI mapping.
- **Plugin hosting:** VST, VST3, LV2.
- **Clip/timeline model:** **Modular live-patch environment, not a clip timeline.** No song-arrangement model in the DAW sense.
- **Agent-control friendliness:** Python is great for agents, but no timeline = wrong shape.
- **Render/export:** Audio export, but live-performance-oriented.
- **Humforge fit:** **2/5** — wrong primitive (modular patcher, not arrangement DAW).

### Audacity / Tenacity
- **License:** Audacity GPLv2; Tenacity GPLv2/v3 fork (verify at github.com/tenacityteam/tenacity LICENSE).
- **Notes:** Editor, not a clip-timeline multi-track DAW with plugin-host arrangement. Tenacity exists because of Audacity's Muse Group telemetry controversy.
- **Humforge fit:** **1/5** — recommend against. Reference only.

### Tracktion Engine
- **License:** **GPLv3 / commercial dual-license**, plus separate JUCE license requirement. ([Tracktion/tracktion_engine](https://github.com/Tracktion/tracktion_engine))
- **Maintenance (2026):** Active — v3.2.0 released 2025-05-15, ~2k commits on develop.
- **Mac/Linux build:** macOS, Windows, Linux, iOS, Android, RPi. C++20 + JUCE; CMake.
- **Scripting / IPC:** No built-in scripting — it's a **library**. You write the host. `EngineInPluginDemo` shows hosting flow.
- **Plugin hosting:** Inherits JUCE: VST3, AU, LV2 (recent JUCE), CLAP via wrappers.
- **Clip/timeline model:** **Full Edit/Track/Clip model** — production-grade DAW data model designed for embedding.
- **Agent-control friendliness:** Highest — agents write C++/JSON that drives the engine; no GUI to scrape; headless render natively.
- **Render/export:** First-class offline render.
- **Humforge fit:** **5/5** — best fit if Humforge is willing to be a *new* app rather than an extension. Caveat: GPLv3 unless commercial license is purchased; JUCE license fees apply for closed-source distribution but JUCE is free for GPL projects.

### Carla
- **License:** GPLv2+. ([falkTX/Carla](https://github.com/falkTX/Carla))
- **Maintenance (2026):** v2.5.10 released 2025-07-31. Active.
- **Mac/Linux/Windows:** All supported.
- **Scripting / IPC:** **OSC remote control**, Python components.
- **Plugin hosting:** LADSPA, DSSI, LV2, VST2, VST3, AU; SF2/SF3/SFZ.
- **Clip/timeline model:** **None** — Carla is a plugin host/router, not a DAW.
- **Render/export:** Limited (audio file player + plugin chain).
- **Humforge fit:** **2/5 standalone, 4/5 as backend** — pair with Ardour or a custom layer for plugin-hosting.

### REAPER
- **License:** **Commercial paid** (~$60 discounted / $225 commercial). DRM-free, but **not redistributable**. ReaScript = Lua/Python/EEL. ([reaper.fm](https://www.reaper.fm/))
- **Maintenance (2026):** Very active.
- **Mac/Linux/Windows:** All three supported (Linux native).
- **Scripting / IPC:** **Best-in-class**: ReaScript (Lua, Python, EEL), OSC, web remote, ReaPack ecosystem.
- **Plugin hosting:** Everything (VST2/3, AU, CLAP, LV2, JSFX).
- **Clip/timeline model:** Industry-standard.
- **Agent-control friendliness:** Excellent via ReaScript.
- **Render/export:** Excellent CLI + scripted render.
- **Humforge fit:** **N/A as harness for an open-source project** — cannot ship REAPER inside Humforge. Useful as a **practical baseline** Humforge users may already own. Verify license terms at reaper.fm/license.php.

### JUCE
- **License:** Dual GPLv3 / commercial (verify at github.com/juce-framework/JUCE LICENSE.md). Latest 8.0.12 (2025-12-16). ([JUCE](https://github.com/juce-framework/JUCE))
- **What it gives you:** Plugin hosting, audio I/O, GUI, format wrappers — **no DAW timeline model.** That's what Tracktion Engine adds on top.
- **Humforge fit:** **3/5** — too low-level alone; pick Tracktion Engine instead.

### Sushi (Elk Audio)
- **License:** AGPLv3 (per LICENSE.md / COPYING — verify). ([elk-audio/sushi](https://github.com/elk-audio/sushi))
- **Maintenance (2026):** v1.3.0 released 2026-03-30. Active.
- **Mac/Linux/Windows:** All three.
- **Scripting / IPC:** **gRPC external control** + config-file driven. Headless by design.
- **Plugin hosting:** VST2, VST3, LV2.
- **Clip/timeline model:** **Limited** — sequencer/synth-host orientation, not a clip arrangement DAW.
- **Render/export:** Supported.
- **Humforge fit:** **3/5** — strong headless+gRPC story but missing arrangement model. AGPL is stricter than GPL.

## Decision matrix (top 5)

| DAW/engine | License risk | Build complexity | Scripting depth | Best Humforge use |
| ---- | ---- | ---- | ---- | ---- |
| Tracktion Engine | Medium (GPLv3 or pay; JUCE too) | Medium (CMake, JUCE) | Library — you build IPC | **Build Humforge as a new app on top** |
| Ardour | Medium-High (GPLv2 contagion, no-LLM rule) | High (gtkmm + 1M LOC) | Excellent (Lua + OSC) | Extend with Lua + OSC, fork-friendly |
| Zrythm | High (AGPL) | Medium | Thin | Watch v2; not yet ready |
| Bespoke Synth | Medium (GPLv3) | Low-Medium | Good (Python live) | Sound-design sandbox, not arrangement |
| Sushi | High (AGPL) | Medium | Good (gRPC) | Headless render farm component |

## Recommendation

- **Primary: Tracktion Engine** — for building Humforge as a *new* C++/JUCE app where agents drive an Edit/Track/Clip model headlessly. GPLv3 is acceptable for an open-source Humforge; commercial dual-license is available if needed later. Best timeline model for agent code-generation, native render-to-file, no GUI to fight.
- **Fallback: Ardour** — for shipping Humforge as a *layer on top of an existing DAW*. Lua + OSC are mature, the timeline is battle-tested, and macOS/Linux are first-class. Accept GPLv2 and the no-LLM contribution policy (means we keep agent-generated code in our repo, not upstream).
- **Practical baseline (closed): REAPER** — for users who already own it. ReaScript (Lua/Python) + OSC give the richest agent-control surface anywhere. We can ship a REAPER-extension flavor of Humforge as an optional path, but cannot redistribute REAPER itself.

## Open questions / things to verify before building
- Verify Tracktion Engine GPL terms vs. JUCE's separate license at github.com/Tracktion/tracktion_engine/blob/master/LICENSE.md and juce.com/legal — confirm GPL-only Humforge can ship without paid JUCE seat.
- Confirm Ardour contribution policy specifics if we ever want patches upstream (LLM-code rule per ardour.org/development.html).
- Test Ardour headless / freewheel render reliability on macOS arm64 in 2026.
- Benchmark Tracktion Engine `EngineInPluginDemo` and `DemoRunner` to confirm offline render perf for voice-stem layering.
- Confirm Zrythm v2 stable date — if it ships with a Lua/Python scripting surface, re-rank.
- Decide Humforge's own license: GPLv3 (compatible with Tracktion Engine GPL path) vs. permissive (would force commercial Tracktion + JUCE seats).
- Evaluate CLAP plugin coverage on each — Humforge agents will likely prefer CLAP for its modern, scriptable semantics.
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
