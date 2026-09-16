# Briefkeeper

A Portuguese voice interview for a creative brief you can review.

[Open the demo](https://briefkeeper-athos.netlify.app) · [lablab team](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon/briefkeeper)

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
