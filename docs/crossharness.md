# CrossHarness Shape

Humforge should be usable from multiple agent/harness environments without rewriting the core.

The repo should separate:

- agent-facing instructions
- machine-readable manifests
- code adapters
- CLI/API surface
- tests and fixtures
- provider/browser recipes
- project/user data

Current hypothesis from existing Ethan repo patterns:

- `agent-bridge` is the best reference for plugin + MCP/server + transport packaging.
- `Repost-with-agent` is the best reference for agent-driven browser workflow, queue/state/proof logs, and setup files.
- `emoji-consistency` and Claude skill repos are the best small examples of text-instructions + scripts + portable skill packaging.
- `producer-player` is the best reference for embedded app agent control and audio-domain UI/state patterns.

A dedicated CrossHarness report is pending.
