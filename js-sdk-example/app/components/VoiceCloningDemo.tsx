'use client';

import { useCallback, useState } from 'react';
import { FileUpload } from './FileUpload';
import { JobStatus } from './JobStatus';
import { AudioPlayer } from './AudioPlayer';
import {
  SynthesisSettings,
  SCIENTIFIC_DEFAULTS,
  type ParameterMode,
  type AiStyle,
  type AiSpeed,
  type ScientificParams,
} from './SynthesisSettings';

type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Turkish' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

export function VoiceCloningDemo() {
  const [refFile, setRefFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');

  const [mode, setMode] = useState<ParameterMode>('default');
  const [style, setStyle] = useState<AiStyle>('natural');
  const [speed, setSpeed] = useState<AiSpeed>('normal');
  const [scientific, setScientific] = useState<ScientificParams>(SCIENTIFIC_DEFAULTS);

  const [status, setStatus] = useState<DemoStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [errorDetails, setErrorDetails] = useState<string | undefined>();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();

  const runClone = useCallback(async () => {
    if (!refFile) {
      setFileError('Please select a reference audio file.');
      return;
    }
    if (!text.trim()) return;
    setFileError(undefined);
    setErrorMessage(undefined);
    setErrorDetails(undefined);
    setStatus('loading');
    setAudioBlob(null);

    const formData = new FormData();
    formData.append('ref_wav', refFile, refFile.name);
    formData.append('text', text.trim());
    formData.append('mode', mode);
    formData.append('language', language);

    if (mode === 'ai') {
      formData.append('style', style);
      formData.append('speed', speed);
    } else if (mode === 'scientific') {
      formData.append('scientific', JSON.stringify(scientific));
    }

    try {
      const res = await fetch('/api/clone', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error ?? `Request failed (${res.status})`);
        setErrorDetails(data.details ?? res.statusText);
        setStatus('error');
        return;
      }

      const blob = await res.blob();
      setAudioBlob(blob);
      setStatus('success');
    } catch (err) {
      setErrorMessage('Network or unexpected error');
      setErrorDetails(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, [refFile, text, mode, language, style, speed, scientific]);

  const handleRetry = useCallback(() => {
    setStatus('idle');
    setErrorMessage(undefined);
    setErrorDetails(undefined);
    runClone();
  }, [runClone]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setAudioBlob(null);
    setErrorMessage(undefined);
    setErrorDetails(undefined);
  }, []);

  const canSubmit =
    !!refFile && text.trim().length > 0 && status !== 'loading';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: Voice Reference + Text */}
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-outline-variant/40">
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
              </svg>
              <h3 className="text-lg font-bold">Voice Reference</h3>
            </div>
            <FileUpload
              onFileSelect={(file) => {
                setRefFile(file);
                setFileError(undefined);
              }}
              selectedFile={refFile}
              error={fileError}
              disabled={status === 'loading'}
            />
          </section>

          <section className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-outline-variant/40">
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
              <h3 className="text-lg font-bold">Text &amp; Language</h3>
            </div>

            <div className="mb-4">
              <label
                htmlFor="language-select"
                className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
              >
                Target Language
              </label>
              <div className="relative">
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={status === 'loading'}
                  className="w-full appearance-none rounded-lg bg-surface-low px-4 py-3 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="synthesis-text"
                className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
              >
                Text to Synthesize
              </label>
              <textarea
                id="synthesis-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste the text you want to clone in this voice..."
                disabled={status === 'loading'}
                rows={6}
                maxLength={5000}
                className="w-full resize-none rounded-lg bg-surface-low p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-2 text-right text-[10px] font-medium text-on-surface-variant">
                {text.length} / 5,000
              </p>
            </div>
          </section>
        </div>

        {/* Right column: Synthesis Settings */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-6">
            <SynthesisSettings
              mode={mode}
              onModeChange={setMode}
              style={style}
              onStyleChange={setStyle}
              speed={speed}
              onSpeedChange={setSpeed}
              scientific={scientific}
              onScientificChange={setScientific}
              onGenerate={runClone}
              isLoading={status === 'loading'}
              canSubmit={canSubmit}
            />
          </div>
        </div>
      </div>

      <JobStatus
        status={status}
        message={
          status === 'loading'
            ? 'Creating clone and synthesizing… This may take a minute.'
            : status === 'success'
              ? 'Done. Play or download below.'
              : status === 'error'
                ? errorMessage
                : undefined
        }
        errorDetails={errorDetails}
        onRetry={status === 'error' ? handleRetry : undefined}
      />

      <AudioPlayer audioBlob={audioBlob} onReset={handleReset} />
    </div>
  );
}
