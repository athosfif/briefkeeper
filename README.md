# Briefkeeper

A multilingual voice interview for a creative brief you can review.

[Open the demo](https://briefkeeper-voice.netlify.app) · [lablab team](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon/briefkeeper)

Briefkeeper organizes objective, audience, deliverables, visual direction, timing, constraints and budget. Accepted AI updates contain a quote from the client transcript. Designers can inspect the source, correct fields, mark them reviewed and export Markdown or JSON with change history. Unknown details remain questions.

## Try it

The fictional example works without credentials or a microphone and is clearly labeled as simulated. Live voice on the hosted demo requires a private reviewer access code and explicit consent to transmit voice to AssemblyAI. Sessions last at most three minutes.

## Run locally

Requires Python 3 and a modern browser. No third-party Python packages.

```sh
cp .env.example .env
# Set ASSEMBLYAI_API_KEY in .env, never in frontend code.
python3 server.py
```

Open http://127.0.0.1:8801. Restart after changing environment variables. This development server binds to loopback; do not expose it as a production server.

## Hosting

Netlify serves `public/` and two functions. Set `ASSEMBLYAI_API_KEY` and `BRIEFKEEPER_ACCESS_CODE` as secret environment variables with Functions scope before deployment. The API key stays server-side; the browser receives a short-lived token. The token endpoint checks the request origin and reviewer code, with a configured limit of three requests per IP/domain per 180 seconds. This is a prototype gate, not full user authentication or a global spend cap.

## Architecture

Browser microphone → AudioWorklet PCM mono 24 kHz → AssemblyAI Voice Agent API WebSocket → transcript, spoken response and structured tool calls → client quote validation → editable brief and explicit export.

`applyEvidence` accepts only supported fields and a literal quote found in a client turn. Quote matching verifies the presence of a source, not semantic accuracy. Human review is still required. Interrupted replies discard pending tool calls.

The app does not record microphone audio or persist conversations to a server. Transcript and brief stay in tab memory until exported; reloading loses unexported work. AssemblyAI receives voice and has its own processing/retention policies.

## Verification

`node tests/core.test.mjs` tests source validation, corrections/history, missing/invalid fields and export. A live synthetic Portuguese speech test exercised authentication, transcription, reply audio, tool calls and session end: three supplied fields were populated while unknown timing and budget remained empty. The creator subsequently confirmed a successful physical-microphone conversation. This is prototype validation, not a reliability benchmark.

## Scope and next step

Built by Athos Figueiredo for the AssemblyAI Voice Agent Hackathon. Next: a small agency pilot measuring completeness, corrections and time to an approved brief. No customer or efficiency results are claimed.

## References

- https://www.assemblyai.com/docs/voice-agents/voice-agent-api/browser-integration
- https://www.assemblyai.com/docs/voice-agents/voice-agent-api/session-configuration
- https://www.assemblyai.com/docs/voice-agents/voice-agent-api/events-reference

Original project code: MIT license. External services remain subject to their own terms.

## R04 review update

Six interface and conversation language options with matched narrators and adjustable playback volume. New client speech resets review approvals; prior field values are visible in change history. Empty or malformed tool updates cannot erase a field. Automated tests cover review invalidation, exact source quotes, language selection and volume bounds. Multilingual recognition and subjective audio quality still require real microphone testing in each language.


## September 26 R05 revision

The built-in fictional coffee-brand walkthrough now follows the selected English or Portuguese interface. Switching examples preserves the correction from a website to packaging, while timing, budget and constraints remain unanswered. No API call is made by the sample.

This revision fixes a feedback loop between the language and volume-label DOM observers. Previously, repeated writes of unchanged labels could make the interface unresponsive. Exact source quotes, history and review invalidation remain part of the workflow.

Run the local regression checks:

```sh
node --test tests/core.test.mjs tests/review-r04.test.mjs tests/language.test.mjs tests/volume.test.mjs tests/sample-r05.test.mjs
```

The September 26 browser review covered the English sample, original-source navigation, preserved correction history, blank unknown fields, reviewed JSON export, manual-edit review invalidation, six interface languages and narrow screens. This does not certify physical microphone quality or current AssemblyAI account balance. Live voice still requires provider access and the private reviewer code.

A separate free, guided edition is available at https://figueirart.com/contribuicoes/briefkeeper/?lang=en. It supports typed answers and on-device transcription after downloading a model, without a paid API key. It is not the same conversational AssemblyAI agent and does not record complete meetings.

Updated English presentation and narrated video are in `docs/delivery-r05/`. The short archived AssemblyAI excerpt is labeled as an earlier session with synthetic Portuguese test speech; it is separate from the fictional walkthrough. Creative direction and development by Athos Figueiredo, with AI assistance.
