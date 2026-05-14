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
        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
        role="status"
        aria-live="polite"
      >
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
          aria-hidden
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          {message ?? 'Cloning voice…'}
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
        role="alert"
      >
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          {message ?? 'Something went wrong'}
        </p>
        {errorDetails && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {errorDetails}
          </p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
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
        className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950"
        role="status"
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-green-500"
          aria-hidden
        />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          {message ?? 'Voice clone ready'}
        </span>
      </div>
    );
  }

  return null;
}
