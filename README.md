# Vyonica SDK Examples

Open-source example apps for the [Vyonica](https://vyonica.com) voice cloning platform. Each example is a self-contained project that shows how to wire the Vyonica SDK into a real application, end-to-end.

> 📚 **For full API details, parameter references, error codes, and authentication, see [docs.vyonica.com](https://docs.vyonica.com).** The READMEs in this repo focus on running the examples — they don't restate the API surface.

## Examples

### [`js-sdk-example/`](./js-sdk-example)

A polished Next.js demo for the [`vyonica`](https://www.npmjs.com/package/vyonica) JavaScript SDK. Drop a reference WAV, type some text, pick a mode, and synthesize a cloned voice. Three control modes are exposed:

| Mode | What it does |
|---|---|
| **AI Mode** | High-level `style` (natural / energetic / serious) and `speed` (slow / normal / fast / very_fast) presets — let the backend pick optimal parameters for you. |
| **Default** | No extra parameters — the server applies its recommended defaults. |
| **Scientific** | Manual sliders for the underlying numeric knobs (`cfgWeight`, `temperature`, `topP`, `minP`, `exaggeration`, `repetitionPenalty`). |

Built with Next.js 16, React 19, and Tailwind v4. The API key is kept server-side via a Next.js API route — never exposed to the browser.

**Quick start:**

```bash
cd js-sdk-example
npm install
cp env.sample .env.local   # then add your VYONICA_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try it out. See [`js-sdk-example/README.md`](./js-sdk-example/README.md) for more details.

## Getting an API key

Sign up at [vyonica.com](https://vyonica.com) and create an API key from your dashboard. Keys are prefixed with `nvsk_`.

## Documentation

- **API reference, parameter definitions, error codes, quotas:** [docs.vyonica.com](https://docs.vyonica.com)
- **JavaScript SDK on npm:** [`vyonica`](https://www.npmjs.com/package/vyonica)
- **Issues / feedback:** [github.com/NexVoice/platform/issues](https://github.com/NexVoice/platform/issues)

## License

See [LICENSE](./LICENSE) (when present) or refer to the individual example READMEs.
