'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from './FileUpload';
import { ParameterControls, type CloneParams } from './ParameterControls';
import { JobStatus } from './JobStatus';
import { AudioPlayer } from './AudioPlayer';

type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

export function VoiceCloningDemo() {
  const [refFile, setRefFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [params, setParams] = useState<CloneParams>({});
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
    setFileError(undefined);
    setErrorMessage(undefined);
    setErrorDetails(undefined);
    setStatus('loading');
    setAudioBlob(null);

    const formData = new FormData();
    formData.append('ref_wav', refFile, refFile.name);
    formData.append('text', text.trim());
    formData.append(
      'options',
      JSON.stringify({
        temperature: params.temperature,
        topP: params.topP,
        minP: params.minP,
        cfgWeight: params.cfgWeight,
        exaggeration: params.exaggeration,
        repetitionPenalty: params.repetitionPenalty,
        language: params.language || undefined,
        synthesisLanguage: params.synthesisLanguage || undefined,
      })
    );

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
  }, [refFile, text, params]);

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
    refFile && text.trim().length > 0 && status !== 'loading';

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FileUpload
          onFileSelect={(file) => {
            setRefFile(file);
            setFileError(undefined);
          }}
          selectedFile={refFile}
          error={fileError}
          disabled={status === 'loading'}
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="synthesis-text"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Text to synthesize
          </label>
          <textarea
            id="synthesis-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to clone in this voice..."
            disabled={status === 'loading'}
            rows={4}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-400"
          />
        </div>

        <ParameterControls
          params={params}
          onChange={setParams}
          disabled={status === 'loading'}
        />

        <button
          type="button"
          onClick={runClone}
          disabled={!canSubmit}
          className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {status === 'loading' ? 'Cloning…' : 'Clone voice'}
        </button>
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
