# Vyonica Voice Cloning Example

Example Next.js app that demonstrates the [`vyonica`](https://www.npmjs.com/package/vyonica) JavaScript SDK for voice cloning.

## Prerequisites

- Node.js 18+
- A [Vyonica API key](https://docs.vyonica.com)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

   This pulls the [`vyonica`](https://www.npmjs.com/package/vyonica) SDK from npm.

2. **Configure environment variables**

   Copy `env.sample` to `.env.local` and set your API key:

   ```bash
   cp env.sample .env.local
   ```

   Edit `.env.local`:

   - `VYONICA_API_KEY` (required) – your Vyonica API key
   - `VYONICA_BASE_URL` (optional) – API base URL, default `https://be.vyonica.com`

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Upload a WAV reference audio file, enter text to synthesize, adjust parameters if needed, and click **Clone voice**. When the job completes, play or download the generated audio.

## Features

- **Reference audio upload** – WAV file used as the voice to clone
- **Text input** – Text to synthesize in the cloned voice
- **Advanced parameters** – Temperature, Top P, Min P, CFG weight, exaggeration, repetition penalty, and source/synthesis language
- **Status and errors** – Loading state, success message, and error details with retry
- **Audio playback and download** – Play the result in the browser or download as WAV

## Project structure

- `app/page.tsx` – Main page that renders the demo
- `app/components/` – React components (VoiceCloningDemo, FileUpload, ParameterControls, JobStatus, AudioPlayer)
- `app/api/clone/route.ts` – Next.js API route that calls the Vyonica SDK (keeps the API key on the server)
