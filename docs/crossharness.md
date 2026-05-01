# CrossHarness Shape

Humforge needs to plug a single audio-generation core (Suno/Udio/Audimee/Kits browser recipes, prompt-craft logic, file/library bookkeeping) into many *agent harnesses* without rewriting the core for each one. A "harness" here means anything that wants to *drive* Humforge: an OpenClaw embedded agent, a Claude Code session (via skills + an MCP server), a local CLI invoked from a terminal, a Telegram bot, a future DAW-side scripting host, or any new agent SDK Ethan adopts. The goal of this doc is to lock down a repo shape — informed by patterns Ethan has already proven in `agent-bridge`, `Repost-with-agent`, `producer-player`, and the small skill repos — so that adding a new harness later means *adding a thin adapter*, not rewriting features.

## Reference repos analyzed

- **`EthanSK/agent-bridge`** — the cleanest example of one project shipping *both* an MCP server and an OpenClaw channel plugin from the same repo, sharing a transport layer and a marketplace manifest. Top-level split: `mcp-server/` (TS, owns `.mcp.json`), `openclaw-channel/` (JS, owns `openclaw.plugin.json`), `skills/` (skill.md instructions), `scripts/`, `docs/`, `site/`, `agent-bridge`/`agent-bridge.cmd` (cross-platform CLI shims), `install.sh` + `install.ps1`, plus a per-side test/ tree.
- **`EthanSK/Repost-with-agent`** — best template for *agent-driven external workflows* (browser recipes, queues, proofs, persistent setup files). Layout: `src/{core,adapters,adapters/{sources,destinations}}`, `commands/{pair,preview,run}.md`, `skills/{repost-pair-setup,repost-run}/SKILL.md`, `templates/repost_with_agent_workspace/{user-setup.json,queue.jsonl,state.json,logs/}`, `scripts/init_*_workspace.py`, `openclaw.plugin.json` at root, `.claude-plugin/plugin.json`.
- **`EthanSK/emoji-consistency`** + **`claude-skill-self-reload-plugins-{mac,windows}`** — minimal skill-only packaging: one `SKILL.md` with YAML frontmatter (`name`, `description`, `allowed-tools`, optional `metadata.openclaw`), a `scripts/` dir with small shell entrypoints (`lookup.sh`, `record.sh`, `prune.sh`), an `install.sh`, no build step. Proves a skill can be a standalone repo *or* a subdir.
- **`EthanSK/producer-player`** — the embedded-agent-in-an-app pattern. Monorepo with `packages/contracts/` (typed messages crossing the renderer↔main↔agent boundary), `packages/domain/` (pure business logic — `song-model.ts`, `file-library-service.ts`), `apps/{electron,renderer,e2e}` consuming both. Agent surface (chat panel, AI recommendations, plugin chain) is exercised by Playwright E2E specs.

## Patterns extracted

### Pattern 1: Core / harness split, with a `contracts` package between them
- **From:** `producer-player:packages/contracts/` and `:packages/domain/`; `agent-bridge:mcp-server/src/{config,inbox,tools,watcher}.ts` (pure) vs `mcp-server/src/index.ts` (transport).
- **What:** Pure domain code (types, business rules) lives in a separate package from any harness adapter. Harnesses import contracts; the core never imports a harness.
- **How Humforge uses it:** `packages/core/` (provider recipes, prompt builders, library) + `packages/contracts/` (`GenerateRequest`, `GenerationProof`, `LibraryEntry`, `ProviderId`, `HarnessEvent`). Every adapter (`mcp-server`, `cli`, `openclaw-channel`, `telegram-bot`) imports from `@humforge/contracts` only.

### Pattern 2: One repo, multiple manifest-shaped subprojects
- **From:** `agent-bridge` ships `.mcp.json` (under `mcp-server/`), `openclaw.plugin.json` (under `openclaw-channel/`), `.claude-plugin/marketplace.json` (root), and `skills/*/SKILL.md` from a single repo. `Repost-with-agent` does the same with `openclaw.plugin.json` + `.claude-plugin/plugin.json` + per-skill `SKILL.md`.
- **What:** Each harness manifest is colocated with the entry point it points at; the marketplace manifest at `.claude-plugin/` advertises the repo as a Claude Code plugin source.
- **How Humforge uses it:** keep `humforge/mcp-server/.mcp.json`, `humforge/openclaw-plugin/openclaw.plugin.json`, `humforge/.claude-plugin/marketplace.json`, and skill files in `humforge/skills/*/SKILL.md`. One `git pull` updates every harness.

### Pattern 3: Persistent user-state directory under `~/.<project>/`
- **From:** `agent-bridge` → `~/.agent-bridge/{config,keys,inbox/}`. `Repost-with-agent` → `~/.repost-with-agent/{pairs.json,history/,learnings/}` plus per-job *workspace* dirs containing `user-setup.json`, `queue.jsonl`, `state.json`, `logs/`. `Repost-with-agent:templates/repost_with_agent_workspace/` ships the canonical empty workspace tree.
- **What:** Two-tier state: (a) a per-user dir for global config/credentials/keys; (b) a per-job *workspace* dir, scaffolded from a `templates/` skeleton by an `init_*_workspace.py` script, so the agent can resume across sessions and machines.
- **How Humforge uses it:** `~/.humforge/{config.json, browser-profile/, providers/{suno,udio,audimee,kits}/cookies/, library/}`. Per-song workspace under `humforge_workspace/<song>/{prompt.json, generations.jsonl, proofs/, audio/, state.json}` scaffolded by `scripts/init_humforge_workspace.py`.

### Pattern 4: Persistent browser profile + proof-of-work logging, never headless-stealth
- **From:** `Repost-with-agent`: `playwrightProfileDir` in the plugin config schema, `safety.preview_before_publish`, `proof_policy.{capture_screenshot,record_final_url,append_run_log}`, an explicit `stop_on_login_challenge` guardrail, and a SKILL.md that bans CAPTCHA/2FA bypass.
- **What:** Browser automation runs against a persistent user profile (login state survives sessions), every action emits a proof artifact (screenshot + final URL + log line), and the agent halts on any auth wall instead of trying to defeat it.
- **How Humforge uses it:** every provider recipe (`adapters/providers/{suno,udio,audimee,kits}.ts`) shares a Playwright runner with `--user-data-dir=~/.humforge/browser-profile/` and writes `proofs/<ts>-<provider>-<step>.{png,json}` next to each generation. A central `safety.ts` enforces "stop on login challenge / payment / unexpected modal" the same way Repost does.

### Pattern 5: Adapter pluralism — sources + destinations as registries, not switch statements
- **From:** `Repost-with-agent:src/adapters/{source.ts,destination.ts}` plus `src/adapters/sources/linkedin.ts` and `src/adapters/destinations/x.ts`. Each adapter implements a small interface; `core/orchestrator.ts` only knows about the interface.
- **What:** Adding a new platform means dropping a file under `adapters/<kind>/` that exports the interface — no edits to core.
- **How Humforge uses it:** `packages/core/src/adapters/providers/{suno,udio,audimee,kits}.ts` each export a `Provider` interface (`generate`, `download`, `list`, `cost`); a registry indexes them by `ProviderId`. New provider = new file, no orchestrator edits.

### Pattern 6: Skill-as-thin-instruction-layer; CLI / MCP do the work
- **From:** `agent-bridge:skills/agent-bridge/SKILL.md` (frontmatter + when-to-activate + table of CLI/MCP tools), `Repost-with-agent:skills/{repost-pair-setup,repost-run}/SKILL.md` (conversation script + which CLI command to call). `emoji-consistency:SKILL.md` is the same shape stripped to the minimum.
- **What:** SKILL.md files are not implementation — they are prompt-time instructions that *route* the agent to the right CLI/MCP tool, with clear "activate when…" triggers and safety bullets. Logic lives in TS/JS, not in markdown.
- **How Humforge uses it:** `skills/humforge-generate/SKILL.md`, `skills/humforge-library/SKILL.md`, `skills/humforge-setup/SKILL.md` — each ~40 lines, pointing at `humforge` CLI subcommands and `mcp__humforge__*` tools. Multiple harnesses (Claude Code, OpenClaw) consume the same SKILL.md.

### Pattern 7: Cross-platform installer + CLI shim
- **From:** `agent-bridge` ships `install.sh` (bash, mac/linux), `install.ps1` (Windows PowerShell), a bash CLI named `agent-bridge`, and `agent-bridge.cmd` as a Windows shim that re-invokes the bash via Git Bash. `~/.claude/CLAUDE.md` notes the shim lives at `%LOCALAPPDATA%\agent-bridge\bin\`.
- **What:** Same CLI works from bash, zsh, PowerShell, and cmd; the install script picks the right packaging path per OS.
- **How Humforge uses it:** `humforge` (bash entrypoint), `humforge.cmd` (Win shim), `install.sh` + `install.ps1`. The CLI delegates to a Node/TS binary built into `dist/`.

## Proposed Humforge top-level layout

```text
humforge/
├── .claude-plugin/
│   └── marketplace.json           # advertises the repo to Claude Code plugin marketplaces
├── mcp-server/                    # MCP harness — exposes humforge_* tools to any MCP client
│   ├── .mcp.json
│   ├── package.json
│   ├── src/
│   │   ├── index.ts               # transport: registers tools, owns stdio
│   │   ├── tools.ts               # thin wrappers over packages/core
│   │   └── config.ts
│   ├── test/
│   └── tsconfig.json
├── openclaw-plugin/               # OpenClaw channel/skill harness
│   ├── openclaw.plugin.json       # channels + configSchema
│   ├── package.json
│   ├── src/
│   │   ├── channel-plugin.js      # message-in / message-out
│   │   └── outbound.js
│   └── test/
├── packages/
│   ├── contracts/                 # shared types — imported by every harness
│   │   └── src/index.ts           # GenerateRequest, GenerationProof, LibraryEntry, ProviderId, HarnessEvent
│   ├── core/                      # pure domain; no harness deps
│   │   └── src/
│   │       ├── adapters/
│   │       │   ├── providers/{suno,udio,audimee,kits}.ts   # registry-style
│   │       │   └── browser-runner.ts                       # shared Playwright runner
│   │       ├── library/           # file/library bookkeeping (cf. producer-player domain)
│   │       ├── prompt/            # prompt-craft logic
│   │       ├── orchestrator.ts    # knows interfaces only (cf. Repost core/orchestrator)
│   │       ├── safety.ts          # stop-on-login / proof policy enforcement
│   │       └── workspace.ts       # read/write per-song workspace
│   └── cli/                       # local-CLI harness; built to dist/cli.js
│       └── src/index.ts
├── skills/                        # SKILL.md instruction files (Claude Code + OpenClaw)
│   ├── humforge-setup/SKILL.md
│   ├── humforge-generate/SKILL.md
│   └── humforge-library/SKILL.md
├── commands/                      # /humforge:* slash commands (Claude Code plugin)
│   ├── generate.md
│   ├── library.md
│   └── setup.md
├── templates/
│   └── humforge_workspace/        # scaffolded by scripts/init_humforge_workspace.py
│       ├── prompt.json
│       ├── generations.jsonl
│       ├── state.json
│       ├── proofs/.gitkeep
│       └── audio/.gitkeep
├── scripts/
│   ├── init_humforge_workspace.py
│   ├── install.sh
│   ├── install.ps1
│   ├── auto-update-coord.sh
│   └── check-update.sh
├── docs/
│   ├── crossharness.md            # this file
│   ├── architecture.md
│   ├── safety.md
│   └── lifecycle-history.md
├── site/                          # GitHub Pages landing (optional, mirrors agent-bridge)
├── humforge                       # bash CLI entrypoint
├── humforge.cmd                   # Windows shim → calls humforge under Git Bash
├── README.md
├── AGENTS.md                      # primary agent-facing instructions
├── INSTRUCTIONS.md                # operator-facing
├── CHANGELOG.md
├── PLUGIN_DESIGN.md
├── package.json                   # workspaces: mcp-server, openclaw-plugin, packages/*
├── tsconfig.base.json
└── LICENSE
```

## Manifests / boundaries

- **`mcp-server/.mcp.json`** — exposes the `humforge_*` MCP tools (`humforge_generate`, `humforge_list_library`, `humforge_get_proof`, `humforge_setup_provider`, `humforge_describe`, `humforge_continue`) to any MCP client (Claude Code, agent-bridge consumers, future Codex/SDK harnesses). Pattern follows `EthanSK/agent-bridge:mcp-server/.mcp.json` (`command: node`, `args: ["${CLAUDE_PLUGIN_ROOT}/build/index.js"]`, env vars for role/config).
- **`openclaw-plugin/openclaw.plugin.json`** — declares the `humforge` channel for OpenClaw embedded agents, plus a `configSchema` mirroring agent-bridge's pattern (paths under `~/.humforge`, browser-profile dir, default provider, peer routing). Skills are exposed via `skills_roots: ["../skills"]` like Repost does.
- **`skills/*/SKILL.md`** — agent-facing instructions consumed by both Claude Code and OpenClaw. Pure routing/conversation guidance, no business logic. Same files serve every Claude-shaped harness.
- **`.claude-plugin/marketplace.json`** — advertises Humforge as a Claude Code plugin (one plugin entry pointing at `./mcp-server`). Mirrors `agent-bridge:.claude-plugin/marketplace.json`.
- **`commands/*.md`** — Claude Code slash commands (`/humforge:generate`, `/humforge:setup`, `/humforge:library`). Same shape as `Repost-with-agent:commands/{pair,preview,run}.md`.
- **`package.json` / language choice** — TypeScript-Node primary, with npm workspaces (matches agent-bridge + producer-player). Python only for ops scripts (`scripts/init_humforge_workspace.py`) where it's already the de-facto standard. Reasons: Playwright is best-in-class in Node; MCP SDK is most mature in TS; producer-player and agent-bridge both prove the workspaces pattern; one runtime simplifies install. No `pyproject.toml` at repo root.

## CrossHarness routing matrix

| Harness | Surface | Notes |
|---|---|---|
| **OpenClaw** | `openclaw-plugin/openclaw.plugin.json` channel + `skills/*/SKILL.md` | Channel handles inbound user messages → calls into `packages/core` via `tools.ts`. Identical to how `agent-bridge:openclaw-channel/` injects into running sessions. |
| **Claude Code** | `mcp-server/.mcp.json` (tools) + `skills/*/SKILL.md` (instructions) + `commands/*.md` (slash commands) + `.claude-plugin/marketplace.json` (install path) | All three surfaces installed by one marketplace entry. |
| **Local CLI** | `humforge` bash entry → `packages/cli` | Pure local use, no agent. Useful for cron jobs and manual debugging. Mirrors `agent-bridge` CLI. |
| **Telegram bot** | OpenClaw's `telegram` channel + Humforge's OpenClaw plugin | No bespoke Telegram code in Humforge — reuses OpenClaw's existing Telegram channel. The `replyVia` pattern from `agent-bridge:openclaw-channel` already covers Telegram-out routing. |
| **DAW plugin / scripting host** | Future: a thin host adapter that imports `packages/contracts` + spawns `packages/cli` as a subprocess (or talks `mcp-server` over stdio). DAWs that embed JS (e.g. Reaper Lua, Ableton M4L, JUCE-with-V8) shell out to `humforge` and read JSONL events. | The `HarnessEvent` contract is the only thing the DAW side needs to depend on. |

## Open questions / decisions to make before building

- **Node/TS as the only primary runtime?** Producer-player and agent-bridge confirm yes; but Humforge may want a small Python helper for audio analysis (loudness, BPM). Decision: TS-first, Python only via subprocess from `scripts/`.
- **MCP-first vs CLI-first?** `agent-bridge` is MCP-first with a CLI shim; `Repost-with-agent` is CLI-first with skill wrappers. Humforge probably wants **MCP-first** because the primary user is an agent — but the CLI must remain a first-class consumer of `packages/core` (not a thin wrapper around the MCP server) so cron/DAW use doesn't depend on a running agent.
- **Where do provider credentials live?** Likely `~/.humforge/providers/<id>/{cookies.json,profile/}` per-provider; OS keychain (macOS Keychain / Windows Credential Manager / libsecret) for any non-cookie secret. Browser-profile-only is the safest default — mirrors Repost's `playwrightProfileDir`.
- **Workspace scope: per-song, per-album, or per-project?** Repost uses per-job workspaces. Humforge probably wants **per-song** workspaces with an optional album manifest grouping them — so the agent can resume one song without entangling siblings.
- **DAW-side embedding model.** Subprocess + JSONL is the cheapest path and survives every DAW; an in-process WebView is nicer UX but couples to a host. Decision: ship subprocess+JSONL first, leave a WebView host adapter as a future package.
- **Hot-reload vs full restart for the MCP child.** Per `~/.claude/CLAUDE.md`, `/reload-plugins` does NOT respawn MCP children. Document up front that updating Humforge requires a Claude Code restart, and version the contracts package strictly so partial updates fail loudly instead of silently.
- **Versioning and contracts evolution.** Adopt the `lifecycle-history.md` pattern from `agent-bridge:docs/` — every breaking change to `packages/contracts` gets a dated entry. CHANGELOG at root for everything else.
- **Test pyramid.** `agent-bridge` has heavy unit tests in `mcp-server/test/` and `openclaw-channel/test/`; `producer-player` has Playwright E2E in `apps/e2e/`. Humforge needs both: unit tests on `packages/core` (mocked Playwright) + E2E specs that drive the real provider browser recipes against a sandbox or live-with-throttling.
