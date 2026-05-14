'use client';

import { useRef, useEffect } from 'react';

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
    const url = URL.createObjectURL(audioBlob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vyonica-output.wav';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Generated audio
      </h3>
      <audio
        ref={audioRef}
        controls
        className="w-full"
        preload="metadata"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
        >
          Download WAV
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            New clone
          </button>
        )}
      </div>
    </div>
  );
}
