'use client';

export interface JobStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  errorDetails?: string;
  onRetry?: () => void;
}

export function JobStatus({
  status,
  message,
  errorDetails,
  onRetry,
}: JobStatusProps) {
  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div
        className="flex items-center gap-3 rounded-xl bg-primary-soft p-4 ring-1 ring-primary/20"
        role="status"
        aria-live="polite"
      >
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
        <span className="text-sm font-medium text-on-surface">
          {message ?? 'Cloning voice…'}
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200"
        role="alert"
      >
        <p className="text-sm font-semibold text-red-800">
          {message ?? 'Something went wrong'}
        </p>
        {errorDetails && (
          <p className="mt-1 text-sm text-red-700">{errorDetails}</p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-red-700 ring-1 ring-red-300 hover:bg-red-50"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        className="flex items-center gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-200"
        role="status"
      >
        <svg
          className="h-5 w-5 text-green-600"
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
        <span className="text-sm font-semibold text-green-800">
          {message ?? 'Voice clone ready'}
        </span>
      </div>
    );
  }

  return null;
}
