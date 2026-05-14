# Vyonica Voice Cloning Example

A polished Next.js demo for the [`vyonica`](https://www.npmjs.com/package/vyonica) JavaScript SDK. Shows off voice cloning with three control modes: **AI Mode** (style + speed presets), **Default Mode** (server-optimized defaults), and **Scientific Mode** (manual numeric parameters).

## Prerequisites

- Node.js 18+
- A [Vyonica API key](https://docs.vyonica.com)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

   This pulls [`vyonica@^0.3.0`](https://www.npmjs.com/package/vyonica) from npm.

2. **Configure environment variables.** Copy `env.sample` to `.env.local` and set your API key:

   ```bash
   cp env.sample .env.local
   ```

   - `VYONICA_API_KEY` (required) – your Vyonica API key
   - `VYONICA_BASE_URL` (optional) – API base URL, default `https://be.vyonica.com`

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Upload a WAV reference, type some text, pick a mode, and hit **Generate Voice**.

## Modes

| Mode | What it sends to the SDK | Use when… |
|---|---|---|
| **AI Mode** | `style` (`natural` / `energetic` / `serious`) and `speed` (`slow` / `normal` / `fast` / `very_fast`) | You want fast, opinionated results without touching numeric parameters. |
| **Default** | Nothing extra | You want the backend's recommended defaults. |
| **Scientific** | `cfgWeight`, `exaggeration`, `temperature`, `topP`, `minP`, `repetitionPenalty` | You want full manual control. |

## Project structure

- `app/page.tsx` – Page shell + header
- `app/components/VoiceCloningDemo.tsx` – Top-level orchestrator (state + layout)
- `app/components/FileUpload.tsx` – Reference WAV drag-and-drop upload
- `app/components/SynthesisSettings.tsx` – 3-tab mode switcher (AI / Default / Scientific) + Generate button
- `app/components/JobStatus.tsx`, `AudioPlayer.tsx` – Status feedback + result playback/download
- `app/api/clone/route.ts` – Next.js API route that calls the Vyonica SDK (keeps the API key on the server)
