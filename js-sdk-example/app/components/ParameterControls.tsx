'use client';

export interface CloneParams {
  temperature?: number;
  topP?: number;
  minP?: number;
  cfgWeight?: number;
  exaggeration?: number;
  repetitionPenalty?: number;
  language?: string;
  synthesisLanguage?: string;
}

export interface ParameterControlsProps {
  params: CloneParams;
  onChange: (params: CloneParams) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  { value: '', label: 'Auto' },
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Turkish' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-800 dark:text-zinc-200">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-600 accent-zinc-800 dark:accent-zinc-200"
      />
    </div>
  );
}

export function ParameterControls({
  params,
  onChange,
  disabled = false,
}: ParameterControlsProps) {
  const update = (key: keyof CloneParams, value: number | string | undefined) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Synthesis parameters
      </h3>

      <Slider
        label="Temperature"
        value={params.temperature ?? 0.7}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => update('temperature', v)}
        disabled={disabled}
      />
      <Slider
        label="Top P"
        value={params.topP ?? 1}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => update('topP', v)}
        disabled={disabled}
      />
      <Slider
        label="Min P"
        value={params.minP ?? 0}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => update('minP', v)}
        disabled={disabled}
      />
      <Slider
        label="CFG weight"
        value={params.cfgWeight ?? 1}
        min={0}
        max={2}
        step={0.1}
        onChange={(v) => update('cfgWeight', v)}
        disabled={disabled}
      />
      <Slider
        label="Exaggeration"
        value={params.exaggeration ?? 1}
        min={0}
        max={2}
        step={0.1}
        onChange={(v) => update('exaggeration', v)}
        disabled={disabled}
      />
      <Slider
        label="Repetition penalty"
        value={params.repetitionPenalty ?? 1.2}
        min={1}
        max={2}
        step={0.05}
        onChange={(v) => update('repetitionPenalty', v)}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-400">
            Source language
          </label>
          <select
            value={params.language ?? ''}
            onChange={(e) => update('language', e.target.value || undefined)}
            disabled={disabled}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value || 'auto'} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-400">
            Synthesis language
          </label>
          <select
            value={params.synthesisLanguage ?? ''}
            onChange={(e) =>
              update('synthesisLanguage', e.target.value || undefined)
            }
            disabled={disabled}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value || 'auto'} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
