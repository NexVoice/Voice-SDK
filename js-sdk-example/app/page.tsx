import { VoiceCloningDemo } from "./components/VoiceCloningDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-4 py-12 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Vyonica Voice Cloning
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Example app using the Vyonica JavaScript SDK
          </p>
        </header>
        <VoiceCloningDemo />
      </main>
    </div>
  );
}
