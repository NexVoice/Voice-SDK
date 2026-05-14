'use client';

import { useEffect, useRef } from 'react';

export interface AudioPlayerProps {
  audioBlob: Blob | null;
  onReset?: () => void;
}

export function AudioPlayer({ audioBlob, onReset }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioBlob || !audioRef.current) return;
    const url = URL.createObjectURL(audioBlob);
    audioRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  if (!audioBlob) return null;

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vyonica-output.wav';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <h3 className="text-lg font-bold">Generated Audio</h3>
      </div>
      <audio
        ref={audioRef}
        controls
        className="w-full"
        preload="metadata"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download WAV
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-surface-low px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-high"
          >
            New clone
          </button>
        )}
      </div>
    </section>
  );
}
