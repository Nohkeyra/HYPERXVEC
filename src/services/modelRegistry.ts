export type ImageModel =
  | 'gemini'
  | 'seedream-4.5'
  | 'seedream-4.0'
  | 'flux-hf'
  | 'cloudflare-sdxl'
  | 'nvidia-nim'
  | 'pollinations'
  | 'ai-horde';

export interface ModelInfo {
  id: ImageModel;
  label: string;
  provider: 'router' | 'google_gemini' | 'byteplus' | 'huggingface';
  modelId?: string;
  requiresApiKey: boolean;
}

export const modelRegistry: Record<ImageModel, ModelInfo> = {
  gemini: {
    id: 'gemini',
    label: 'Gemini 2.5 Flash',
    provider: 'router',
    modelId: 'gemini-2.5-flash-image',
    requiresApiKey: false,
  },
  'seedream-4.5': {
    id: 'seedream-4.5',
    label: 'Seedream 4.5',
    provider: 'router',
    modelId: 'seedream-4-5-251128',
    requiresApiKey: false,
  },
  'seedream-4.0': {
    id: 'seedream-4.0',
    label: 'Seedream 4.0',
    provider: 'router',
    modelId: 'seedream-4-0-250828',
    requiresApiKey: false,
  },
  'flux-hf': {
    id: 'flux-hf',
    label: 'Flux.1 Schnell (HF)',
    provider: 'router',
    modelId: 'black-forest-labs/FLUX.1-schnell',
    requiresApiKey: false,
  },
  'cloudflare-sdxl': {
    id: 'cloudflare-sdxl',
    label: 'Cloudflare SDXL',
    provider: 'router',
    modelId: 'cloudflare',
    requiresApiKey: false,
  },
  'nvidia-nim': {
    id: 'nvidia-nim',
    label: 'NVIDIA NIM',
    provider: 'router',
    modelId: 'nim',
    requiresApiKey: false,
  },
  pollinations: {
    id: 'pollinations',
    label: 'Pollinations',
    provider: 'router',
    modelId: 'pollinations',
    requiresApiKey: false,
  },
  'ai-horde': {
    id: 'ai-horde',
    label: 'AI Horde',
    provider: 'router',
    modelId: 'aihorde',
    requiresApiKey: false,
  },
};
