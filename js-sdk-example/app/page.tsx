import { VoiceCloningDemo } from "./components/VoiceCloningDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg font-sans">
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            Vyonica SDK
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            Voice Cloning Demo
          </h1>
          <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
            Drop a reference WAV, type some text, and synthesize a clone using
            the <code className="font-mono text-primary">vyonica</code> JavaScript
            SDK. Try AI Mode for one-click presets, or Scientific Mode for
            fine-grained control.
          </p>
        </header>
        <VoiceCloningDemo />
      </main>
    </div>
  );
}
