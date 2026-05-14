'use client';

import { useCallback, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
      e.target.value = '';
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [disabled, onFileSelect]
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="ref-wav-input"
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group flex aspect-[2/1] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          disabled
            ? 'cursor-not-allowed border-outline-variant bg-surface-high/40 text-on-surface-variant/60'
            : isDragging
              ? 'border-primary bg-primary-soft/60 text-primary'
              : 'border-outline-variant bg-surface-low/40 text-on-surface-variant hover:border-primary/60 hover:bg-primary-soft/30'
        }`}
      >
        <input
          id="ref-wav-input"
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        {selectedFile ? (
          <>
            <svg
              className="mb-2 h-10 w-10 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm font-semibold text-primary">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Click to change
            </p>
          </>
        ) : (
          <>
            <svg
              className="mb-2 h-10 w-10 text-on-surface-variant group-hover:text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            <p className="text-sm font-semibold text-on-surface">
              Upload .WAV sample
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Drag and drop or click to browse
            </p>
          </>
        )}
      </label>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-on-surface-variant/80">
          WAV files only, up to 50 MB
        </p>
        {selectedFile && (
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
            className="text-xs font-bold text-on-surface-variant hover:text-primary disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
