# Metronome Feature

Default request:

> Send me a metronome.

Default behavior:

- 2 minutes
- plain click sound
- sensible default BPM if omitted, or ask if BPM is genuinely necessary
- send audio back to chat

Custom options:

- BPM
- duration
- time signature
- count-in
- accents
- swing
- subdivisions
- click sound / drum sound / weird sound

Example requests:

- “Send me 2 minutes of 128 BPM clicks.”
- “Give me a 90-second 140 BPM garage metronome with hats.”
- “Make the downbeat louder.”
- “Give me something less annoying than a normal click.”

Implementation notes:

- Generate locally where possible.
- Keep metronome renders deterministic and cacheable by settings.
- Store generated metronomes as project artifacts so later voice notes can be aligned against them.
