'use client';

export type ParameterMode = 'ai' | 'default' | 'scientific';
export type AiStyle = 'natural' | 'energetic' | 'serious';
export type AiSpeed = 'slow' | 'normal' | 'fast' | 'very_fast';

export interface ScientificParams {
  cfgWeight: number;
  exaggeration: number;
  temperature: number;
  topP: number;
  minP: number;
  repetitionPenalty: number;
}

export const SCIENTIFIC_DEFAULTS: ScientificParams = {
  cfgWeight: 1.0,
  exaggeration: 1.0,
  temperature: 0.7,
  topP: 1.0,
  minP: 0.0,
  repetitionPenalty: 1.2,
};

const PARAM_META: {
  key: keyof ScientificParams;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: 'cfgWeight', label: 'CFG Weight', min: 0, max: 2, step: 0.05 },
  { key: 'exaggeration', label: 'Exaggeration', min: 0, max: 2, step: 0.05 },
  { key: 'temperature', label: 'Temperature', min: 0, max: 1, step: 0.05 },
  { key: 'topP', label: 'Top-p', min: 0, max: 1, step: 0.05 },
  { key: 'minP', label: 'Min-p', min: 0, max: 1, step: 0.05 },
  { key: 'repetitionPenalty', label: 'Rep. Penalty', min: 1, max: 2, step: 0.05 },
];

export interface SynthesisSettingsProps {
  mode: ParameterMode;
  onModeChange: (mode: ParameterMode) => void;
  style: AiStyle;
  onStyleChange: (s: AiStyle) => void;
  speed: AiSpeed;
  onSpeedChange: (s: AiSpeed) => void;
  scientific: ScientificParams;
  onScientificChange: (p: ScientificParams) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canSubmit: boolean;
}

const STYLES: AiStyle[] = ['natural', 'energetic', 'serious'];
const SPEEDS: AiSpeed[] = ['slow', 'normal', 'fast', 'very_fast'];

function fmtLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SynthesisSettings({
  mode,
  onModeChange,
  style,
  onStyleChange,
  speed,
  onSpeedChange,
  scientific,
  onScientificChange,
  onGenerate,
  isLoading,
  canSubmit,
}: SynthesisSettingsProps) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-outline-variant/40">
      <div className="mb-6 flex items-center gap-2">
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
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        <h3 className="text-lg font-bold">Synthesis Settings</h3>
      </div>

      {/* Mode switcher */}
      <div className="mb-8 flex gap-1 rounded-xl bg-surface-low p-1">
        {(['ai', 'default', 'scientific'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === m
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {m === 'ai' ? 'AI Mode' : m === 'default' ? 'Default' : 'Scientific'}
          </button>
        ))}
      </div>

      {mode === 'ai' && (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Style
            </label>
            <div className="flex gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStyleChange(s)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    style === s
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
                  }`}
                >
                  {fmtLabel(s)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Speed
            </label>
            <div className="flex gap-2">
              {SPEEDS.map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => onSpeedChange(sp)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    speed === sp
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
                  }`}
                >
                  {fmtLabel(sp)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'default' && (
        <div className="flex items-start gap-3 rounded-xl bg-surface-low p-4">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-[12px] italic leading-relaxed text-on-surface-variant">
            Default mode uses optimized parameters for balanced voice quality.
            No additional configuration needed.
          </p>
        </div>
      )}

      {mode === 'scientific' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {PARAM_META.map((p) => (
              <div key={p.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {p.label}
                  </label>
                  <span className="font-mono text-[10px] font-bold text-primary">
                    {scientific[p.key].toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={scientific[p.key]}
                  onChange={(e) =>
                    onScientificChange({
                      ...scientific,
                      [p.key]: parseFloat(e.target.value),
                    })
                  }
                  className="w-full cursor-pointer"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onScientificChange(SCIENTIFIC_DEFAULTS)}
            className="text-xs font-bold text-on-surface-variant hover:text-primary"
          >
            Reset to Defaults
          </button>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl signature-gradient px-4 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Voice
            </>
          )}
        </button>
      </div>
    </section>
  );
}
