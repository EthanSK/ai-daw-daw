# Trendy Voice-to-Music AI Tools Research

Reference for Humforge planning: which 2026-era AI music tools could power a voice-first pipeline (Telegram voice note in → song layers/stems out). Focus is on hum/sing input fidelity, agent-driveability, rights, and cost.

## Evaluation criteria
- **Audio input** — does the tool accept user audio (humming, singing, beatbox, reference) as a conditioning signal, not just text?
- **Hum/sing → song quality** — does it preserve the user's melody/groove, or just take "vibe"?
- **Stems / layers / export** — can we get separable parts back, or only a mix?
- **Automation surface** — official API, unofficial wrapper, browser-only, or local model.
- **Cost (2026)** — paid is fine; want ballpark.
- **Rights / licensing** — can the user release the output? Are agentic/automated calls allowed by ToS?
- **Mac/Linux compatibility** — Humforge is Mac-first dev, agents run on Mac Mini.

## Tools

### Suno
- **Audio input:** Yes. "Audio Inputs" feature accepts uploaded or recorded clips, 6-60 s on free tier, up to 8 minutes on Pro/Premier.
- **Hum/sing → song:** Strong. Marketed exactly for this — drum mouth-noises, hummed melodies, etc. Uses "Extend" with a chosen genre + optional lyrics.
- **Stems / layers / export:** Stems export is a Pro/Premier feature (vocals + instrumental + some per-track separation), but officially Suno is mix-first. Better to re-separate with Music.AI or Moises if you need clean stems.
- **API / automation:** No official public API as of 2026. Multiple unofficial wrappers exist (sunoapi.org, udioapi.pro, apiframe.ai, AI/ML API). Suno's ToS explicitly prohibits unauthorized automated access — using a wrapper is a ToS-gray-area decision Humforge should accept consciously. Browser automation via Playwright is technically possible but same ToS issue.
- **Cost (2026):** Pro ~$10/mo, Premier ~$30/mo for higher concurrency + 8-min uploads. Wrapper APIs roughly $0.014/track at bulk.
- **Rights / licensing:** Pro/Premier subscribers own commercial rights to outputs; free tier is non-commercial. Copyrighted uploads are blocked.
- **Humforge fit:** **5/5** — audio-input + hum-to-song is the closest match to Humforge's core UX. Accept the ToS caveat or get explicit partner access.
- Sources: [help.suno.com/articles/6141569](https://help.suno.com/en/articles/6141569), [suno.com/blog/audio-inputs](https://suno.com/blog/audio-inputs), [aimlapi.com/blog/the-suno-api-reality](https://aimlapi.com/blog/the-suno-api-reality)

### Udio
- **Audio input:** Yes. Five upload-driven modes: Extend, Inpaint, Session (waveform editor), Remix, Style.
- **Hum/sing → song:** Decent for instrumental/melodic uploads; their docs explicitly warn a-cappella vocal uploads "aren't likely to work great" — which is exactly the Humforge use case, so test before committing.
- **Stems / layers / export:** Inpaint enables surgical edits; stems export available on paid tiers. Session mode exposes a waveform-level editing surface that an agent could drive.
- **API / automation:** Official Enterprise API exists in 2026 (Pro/Enterprise tier-gated, Python + Node SDKs, async + webhooks). Third-party wrappers (udioapi.pro, MusicAPI.ai) also exist. **Needs verification** — fetch [help.udio.com](https://help.udio.com/en/articles/10754328-create-music-with-your-own-audio) and Udio's API docs page directly to confirm Enterprise API terms and minimums.
- **Cost (2026):** Standard ~$10/mo, Pro ~$30/mo, Enterprise custom.
- **Rights / licensing:** Now operating under Universal/Warner licensing deals (2026), so output rights are clearer than 2024-era. Verify per-tier commercial use terms.
- **Humforge fit:** **4/5** — Inpaint + Session are powerful but a-cappella weakness is a real concern. Best as a *secondary* generator after Suno.
- Sources: [help.udio.com/articles/10754328](https://help.udio.com/en/articles/10754328-create-music-with-your-own-audio), [aitoolsdevpro.com/ai-tools/udio-guide](https://aitoolsdevpro.com/ai-tools/udio-guide/)

### Music.AI / Moises Developer API
- **Audio input:** Yes — file-based, async pipeline. Feeding hum.wav is a first-class operation.
- **Hum/sing → song:** Not a generator — this is the **analysis/decomposition layer**. Modules cover stem isolation, vocals/accompaniment separation, BPM + beat detection, key detection, lyrics transcription, chord detection, and (per docs nav) voice-to-MIDI-style transcription. Custom workflows chain modules.
- **Stems / layers / export:** Best-in-class stem separation; outputs delivered as URLs.
- **API / automation:** Official REST API with async jobs (`POST /job` → poll `GET /job/:id`). Webhook support advertised on the marketing page; verify on docs. Auth via API key.
- **Cost (2026):** Pay-as-you-go (free start, per-minute pricing $0.0005-$3/min by module), Professional $25/mo with $25 credit included, Business custom.
- **Rights / licensing:** User-friendly — you own your input and the analysis output.
- **Humforge fit:** **5/5** — this is the obvious pre-processing brain: take the voice note, classify (hum vs sing vs beatbox), extract pitch/tempo/key, then route to a generator. Pair with Suno/Udio.
- Sources: [music.ai/docs/api/reference](https://music.ai/docs/api/reference/), [music.ai/pricing](https://music.ai/pricing/) (note: developer.moises.ai redirects to music.ai/docs)

### Audimee
- **Audio input:** Yes — upload or record vocals.
- **Hum/sing → song:** Voice *conversion*, not full song. Replaces user's voice with one of ~200 royalty-free AI singers; supports pitch-line editing, voice mixing, custom voice training.
- **Stems / layers / export:** Single converted vocal track only.
- **API / automation:** No public API mentioned. Browser-only — would require Playwright automation.
- **Cost (2026):** Free tier exists; paid tier pricing not on the public tools page (needs verification).
- **Rights / licensing:** Royalty-free output advertised.
- **Humforge fit:** **3/5** — useful as a *vocal beautifier* in the pipeline (sing the melody → swap to a polished AI singer), not a primary generator.
- Sources: [audimee.com/tools/ai-singing-voice-generator](https://audimee.com/tools/ai-singing-voice-generator)

### Kits.AI
- **Audio input:** Yes — voice cloning, vocal isolation, stem separation.
- **Hum/sing → song:** Closest feature is **AI instrument library for sketching ideas** (voice-to-instrument-ish) plus voice conversion onto 100+ royalty-free artist voices. Also: harmony generation, key/BPM detection.
- **Stems / layers / export:** Yes — full stem separation.
- **API / automation:** Yes — explicit developer API for integration. **Needs verification** — fetch kits.ai/api/docs for endpoints, rate limits, pricing.
- **Cost (2026):** Free tier (no card), paid from $10/mo.
- **Rights / licensing:** Ethically-sourced, licensed voice catalog with revenue-share to artists.
- **Humforge fit:** **4/5** — strong fit if voice-to-instrument is robust; the API + ethical licensing make it agent-friendly. Test the instrument sketcher with hummed input.
- Sources: [kits.ai](https://kits.ai/)

### ElevenLabs Music
- **Audio input:** **No** — text prompt only. No audio conditioning advertised on the public Music page.
- **Hum/sing → song:** Not directly. Could be used as a *generator* after Music.AI extracts a text description from a hum, but the user's melody won't be preserved.
- **Stems / layers / export:** 44.1 kHz studio-grade output; layer/stems specifics not documented on landing page.
- **API / automation:** Yes — Eleven Music API for integrations.
- **Cost (2026):** Tiered subscription; pricing not on the Music landing page (needs verification).
- **Rights / licensing:** Standard ElevenLabs commercial terms (verify per tier).
- **Humforge fit:** **2/5** — no audio input is a dealbreaker for the core hum-to-song flow. Possible *layer-fill* role only.
- Sources: [elevenlabs.io/music](https://elevenlabs.io/music)

### Google Lyria (Vertex AI)
- **Audio input:** Lyria 2 is text-to-music only (30-second instrumental WAV, 48 kHz). Lyria 3 / Lyria 3 Pro (public preview) adds image-to-music and vocal support but **still primarily text-conditioned** — no documented hum-conditioning. Needs verification if `lyria-3` accepts audio reference.
- **Hum/sing → song:** Not in publicly documented capabilities.
- **Stems / layers / export:** Single mix WAV output.
- **API / automation:** Vertex AI API, requires GCP billing + project, enterprise-friendly.
- **Cost (2026):** Per-second Vertex generative-media billing; needs verification on Lyria 3 pricing page.
- **Rights / licensing:** Enterprise-clean — Google indemnification typical for Vertex generative models.
- **Humforge fit:** **2/5** for the voice-first core flow; **4/5** as a clean-rights *backup generator* for instrumental beds.
- Sources: [cloud.google.com/blog/.../lyria-3-on-vertex-ai](https://cloud.google.com/blog/products/ai-machine-learning/lyria-3-and-lyria-3-pro-on-vertex-ai), [docs.cloud.google.com/vertex-ai/.../music](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/music/generate-music)

### Stability AI Stable Audio (2.5 + Open)
- **Audio input:** Yes — Stable Audio 2.0+ supports text-to-audio **and audio-to-audio** ("transform uploaded samples via natural language prompts"). Up to 3-min tracks at 44.1 kHz stereo.
- **Hum/sing → song:** Audio-to-audio is plausibly suited for hum-conditioning, though primarily marketed for sample transformation, not melody-preserving song completion. Test required.
- **Stems / layers / export:** Mix output; structured composition mode adds some controllability.
- **API / automation:** Hosted API (also via Replicate: `stability-ai/stable-audio-2.5`). Stable Audio Open weights downloadable for local Mac/Linux runs.
- **Cost (2026):** Replicate per-second pricing; Stability Community License free for orgs <$1M revenue, Enterprise license required above.
- **Rights / licensing:** Cleanest of the open/semi-open options — Community License explicitly permits commercial use under the revenue threshold.
- **Humforge fit:** **4/5** — best license clarity + audio-to-audio + local-runnable variant. Strong for self-hosted layer generation.
- Sources: [stability.ai/stable-audio](https://stability.ai/stable-audio), [stability.ai/license](https://stability.ai/license), [replicate.com/stability-ai/stable-audio-2.5](https://replicate.com/stability-ai/stable-audio-2.5/api/api-reference)

### ACE-Step / YuE / MusicGen / JASCO (open research models)
- **ACE-Step (1.5):** Open-source diffusion-based foundation model; 4-min song in ~20 s. Runs locally on Mac (Apple Silicon supported), AMD, Intel, CUDA. Apache-style permissive license. Lyrics + style conditioning; melody-conditioning support is limited — needs verification. [ace-step.io](https://ace-step.io/)
- **YuE:** LLaMA-2-based autoregressive lyrics-to-full-song with multilingual + voice cloning + style transfer. Apache-2.0. Heavy GPU model — Mac runs are tight but possible on M-series with quantization.
- **MusicGen / AudioCraft (Meta):** MIT-licensed, supports text-to-music **and melody conditioning** (hum → instrumental that follows the hummed contour). Best fit for hum-conditioned local generation.
- **JASCO:** Meta's follow-up to MusicGen with finer temporal/style controls (chord, drum, melody conditioning). Same MIT-style permissive license family.
- **Humforge fit:** **4/5** for MusicGen/JASCO specifically (melody conditioning is exactly hum-to-music); **3/5** for ACE-Step/YuE (great quality, weaker hum-conditioning story). Local Mac-Mini inference is realistic for MusicGen-medium.
- Sources: [github.com/ace-step/ACE-Step](https://github.com/ace-step/ACE-Step), [arxiv.org/abs/2506.00045](https://arxiv.org/abs/2506.00045)

### Vochlea Dubler 2 / Samplab / Melodyne / RipX (reference benchmarks)
- **Vochlea Dubler 2:** Real-time voice/hum → MIDI. Mac + Windows, standalone + plugin. No public API; would require local-DAW automation (OSC, virtual MIDI loopback) to script. Best-in-class for *real-time* hum-to-MIDI; Humforge's flow is async so less critical.
- **Samplab:** Cloud-hybrid audio-to-MIDI; subscription. Plugin + standalone. No public API.
- **Melodyne (Celemony):** Polyphonic audio → MIDI extraction; gold standard for pitch-correction surface. Mac + Win plugin. ARA integration with DAWs; not API-driveable headlessly.
- **RipX (Hit'n'Mix):** Local AI DAW with audio-to-MIDI + stem separation. One-time license, Mac + Win, no headless API.
- **Humforge fit:** **2/5** as primary tools (no scriptable APIs, all are GUI-bound), but **5/5 as benchmarks** for what hum-to-MIDI quality should feel like. Consider Samplab/Dubler licenses for offline reference renders during pipeline tuning.
- Sources: [vochlea.com/products/dubler2](https://vochlea.com/products/dubler2)

## Ranked recommendation for Humforge

1. **Music.AI / Moises** — best for the **analysis brain**. Voice note in → BPM + key + transcription + stems out. Official API, async jobs, fair pricing, clean rights. Always-on first stage.
2. **Suno** — best for the **vibe-driven full song**. Audio Inputs feature is the closest single-shot match to Humforge's UX. ToS friction is the only real blocker; either accept wrapper risk or pursue partner API.
3. **MusicGen / JASCO (local)** — best for **melody-conditioned instrumental layers** that must preserve the hummed contour. MIT license, runs on Mac Mini.
4. **Udio** — best for **iterative editing** (Inpaint, Session). Pair with Suno for variety; verify Enterprise API access.
5. **Stable Audio 2.5** — best for **clean-rights ambient/sample-style layers**. Audio-to-audio + Community License + Replicate-hosted API.
6. **Kits.AI** — best for **vocal conversion + voice-to-instrument sketching** with an API.
7. **Audimee** — niche **vocal beautifier** if Kits.AI doesn't fit; browser-automation only.
8. **ElevenLabs Music** — text-only; reserve for *fill* layers driven by an LLM-generated prompt.
9. **Google Lyria** — enterprise backup; not voice-first.
10. **Vochlea / Samplab / Melodyne / RipX** — local reference benchmarks; not in the production pipeline.

## Adapter routing matrix

| Tool | Adapter type | Best use case in Humforge |
| --- | --- | --- |
| Music.AI / Moises | API | Pre-process: stems, key, BPM, transcription |
| Suno | Wrapper API or browser | Full hum-to-song generation |
| Udio | Official API (Pro/Ent) | Iterative inpaint/extend on a generated draft |
| MusicGen / JASCO | Local (Mac Mini) | Melody-conditioned instrumental layers |
| Stable Audio 2.5 | Hosted API (Replicate) + local Open | Sample/ambient layer generation |
| Kits.AI | API | Voice conversion, voice-to-instrument |
| Audimee | Browser (Playwright) | Vocal beautifier |
| ElevenLabs Music | API | Text-prompt fill layers |
| Google Lyria | API (Vertex) | Enterprise-clean instrumental backup |
| Vochlea / Samplab / Melodyne / RipX | Local GUI (benchmark only) | Manual reference renders |

## Open questions / things to verify before building

- **Suno ToS** — is there a partner/business program that legitimizes agentic access? Worth a sales-team email before building on top of unofficial wrappers.
- **Udio Enterprise API** — minimum spend, hum-input quality (their a-cappella warning), and whether Inpaint is exposed via API or only in the web Session editor.
- **Music.AI module list** — confirm voice-to-MIDI / pitch-track export is a real module (not just BPM/key); fetch [music.ai/modules](https://music.ai/modules/).
- **Lyria 3 audio conditioning** — does the `lyria-3` Vertex endpoint accept an audio reference clip, or is "audio support" only on the *output* side?
- **MusicGen melody-conditioning UX** — verify quality on real Telegram-recorded hums (which are noisy, low-bitrate OGG); may need an upstream denoise/pitch-extract pass via Music.AI.
- **Kits.AI API surface** — endpoints, rate limits, latency, voice-to-instrument fidelity from a hum.
- **Rights stack** — for a song combining Suno generation + Udio inpaint + Music.AI stems + a Kits.AI voice conversion, what's the cleanest commercial-release contract? Likely "user retains rights, Humforge passes through tool licenses."
- **Latency budget** — Telegram voice note → first preview should target <60 s. Music.AI + Suno + a single layer pass probably fits; full Udio inpaint round-trips probably don't.
- **Voice-note-quality preprocessing** — Telegram OGG/Opus is 16 kHz mono; many tools want 44.1 kHz. Need a normalizer step (ffmpeg or Music.AI enhance module) before everything else.
