import { NextResponse } from 'next/server';
import { VyonicaClient } from 'vyonica';
import {
  AuthenticationError,
  QuotaExceededError,
  JobFailedError,
  JobTimeoutError,
  VyonicaError,
} from 'vyonica';

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
    return NextResponse.json(
      { error: 'Invalid form data' },
      { status: 400 }
    );
  }

  const file = formData.get('ref_wav');
  const text = formData.get('text');
  const optionsJson = formData.get('options');

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

  let options: Record<string, unknown> = {};
  if (optionsJson && typeof optionsJson === 'string') {
    try {
      options = JSON.parse(optionsJson) as Record<string, unknown>;
    } catch {
      // use defaults
    }
  }

  const client = new VyonicaClient({
    apiKey,
    baseUrl: baseUrl || 'https://be.vyonica.com',
  });

  const cloneOptions = {
    text: text.trim(),
    language: options.language as string | undefined,
    synthesisLanguage: options.synthesisLanguage as string | undefined,
    temperature: options.temperature as number | undefined,
    topP: options.topP as number | undefined,
    minP: options.minP as number | undefined,
    cfgWeight: options.cfgWeight as number | undefined,
    exaggeration: options.exaggeration as number | undefined,
    repetitionPenalty: options.repetitionPenalty as number | undefined,
  };

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
