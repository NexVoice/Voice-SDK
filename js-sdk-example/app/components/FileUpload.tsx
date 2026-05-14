'use client';

import { useCallback } from 'react';

export interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
  disabled?: boolean;
}

export function FileUpload({
  accept = 'audio/wav,.wav',
  onFileSelect,
  selectedFile,
  error,
  disabled = false,
}: FileUploadProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
      e.target.value = '';
    },
    [onFileSelect]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Reference audio (WAV)
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors ${
            disabled
              ? 'cursor-not-allowed border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              : 'border-zinc-400 bg-zinc-50 text-zinc-600 hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:bg-zinc-700'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          {selectedFile ? selectedFile.name : 'Choose file'}
        </label>
        {selectedFile && (
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            Clear
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
