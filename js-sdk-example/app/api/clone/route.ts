import { NextResponse } from 'next/server';
import {
  VyonicaClient,
  AuthenticationError,
  QuotaExceededError,
  JobFailedError,
  JobTimeoutError,
  VyonicaError,
  type CloneOptions,
} from 'vyonica';

const ALLOWED_STYLES = ['natural', 'energetic', 'serious'] as const;
const ALLOWED_SPEEDS = ['slow', 'normal', 'fast', 'very_fast'] as const;
type AiStyle = (typeof ALLOWED_STYLES)[number];
type AiSpeed = (typeof ALLOWED_SPEEDS)[number];

function isStyle(v: unknown): v is AiStyle {
  return typeof v === 'string' && (ALLOWED_STYLES as readonly string[]).includes(v);
}
function isSpeed(v: unknown): v is AiSpeed {
  return typeof v === 'string' && (ALLOWED_SPEEDS as readonly string[]).includes(v);
}

export async function POST(request: Request) {
  const apiKey = process.env.VYONICA_API_KEY;
  const baseUrl = process.env.VYONICA_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'VYONICA_API_KEY is not configured' },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('ref_wav');
  const text = formData.get('text');
  const mode = formData.get('mode');
  const language = formData.get('language');

  if (!file || !(file instanceof Blob) || file.size === 0) {
    return NextResponse.json(
      { error: 'Reference audio file (ref_wav) is required' },
      { status: 400 }
    );
  }
  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json(
      { error: 'Text to synthesize is required' },
      { status: 400 }
    );
  }

  const cloneOptions: CloneOptions = {
    text: text.trim(),
    language: typeof language === 'string' && language ? language : 'en',
  };

  if (mode === 'ai') {
    const style = formData.get('style');
    const speed = formData.get('speed');
    if (!isStyle(style) || !isSpeed(speed)) {
      return NextResponse.json(
        {
          error: 'AI mode requires valid style and speed',
          details: `style must be one of ${ALLOWED_STYLES.join('|')}, speed must be one of ${ALLOWED_SPEEDS.join('|')}`,
        },
        { status: 400 }
      );
    }
    cloneOptions.style = style;
    cloneOptions.speed = speed;
  } else if (mode === 'scientific') {
    const sciJson = formData.get('scientific');
    if (typeof sciJson === 'string') {
      try {
        const sci = JSON.parse(sciJson) as Partial<{
          cfgWeight: number;
          exaggeration: number;
          temperature: number;
          topP: number;
          minP: number;
          repetitionPenalty: number;
        }>;
        if (typeof sci.cfgWeight === 'number') cloneOptions.cfgWeight = sci.cfgWeight;
        if (typeof sci.exaggeration === 'number') cloneOptions.exaggeration = sci.exaggeration;
        if (typeof sci.temperature === 'number') cloneOptions.temperature = sci.temperature;
        if (typeof sci.topP === 'number') cloneOptions.topP = sci.topP;
        if (typeof sci.minP === 'number') cloneOptions.minP = sci.minP;
        if (typeof sci.repetitionPenalty === 'number') cloneOptions.repetitionPenalty = sci.repetitionPenalty;
      } catch {
        // fall through to defaults
      }
    }
  }
  // mode === 'default' → send nothing extra; backend uses optimized defaults

  const client = new VyonicaClient({
    apiKey,
    baseUrl: baseUrl || 'https://be.vyonica.com',
  });

  try {
    const audioBuffer = await client.clone(file, cloneOptions, {
      intervalMs: 2000,
      timeoutMs: 300000,
    });

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="output.wav"',
      },
    });
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json(
        { error: 'Invalid API key', details: err.message },
        { status: 401 }
      );
    }
    if (err instanceof QuotaExceededError) {
      return NextResponse.json(
        { error: 'Quota exceeded', details: err.message },
        { status: 429 }
      );
    }
    if (err instanceof JobFailedError) {
      return NextResponse.json(
        { error: 'Job failed', details: err.errorMessage, jobId: err.jobId },
        { status: 422 }
      );
    }
    if (err instanceof JobTimeoutError) {
      return NextResponse.json(
        { error: 'Job timed out', details: err.message, jobId: err.jobId },
        { status: 408 }
      );
    }
    if (err instanceof VyonicaError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode > 0 ? err.statusCode : 500 }
      );
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Clone failed', details: message },
      { status: 500 }
    );
  }
}
