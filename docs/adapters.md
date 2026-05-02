# Adapter Strategy

AI DAW DAW should not assume the best music AI tools have clean APIs.

Adapter types:

- local CLI/model adapter
- HTTP API adapter
- browser-use adapter
- DAW/plugin adapter
- manual/export adapter

Every adapter should expose:

- name
- provider
- setup requirements
- input types
- output types
- whether audio leaves the machine
- cost notes
- license / terms notes
- automation reliability
- provenance metadata

Browser-use adapters are first-class. If a paid web tool is genuinely the best way to turn a hum into an instrument layer, AI DAW DAW can store instructions for an agent to use that tool through a logged-in browser, while still keeping provenance and approval around the result.
