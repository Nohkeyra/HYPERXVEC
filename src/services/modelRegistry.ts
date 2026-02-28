export type ImageModel = 'gemini' | 'hidream' | 'flux-dev' | 'flux-schnell' | 'sdxl' | 'openjourney' | 'seedream';

export interface ModelInfo {
  id: ImageModel;
  label: string;
  provider: 'google_gemini' | 'huggingface_api' | 'byteplus';
  modelId?: string; // For Hugging Face models
  requiresApiKey: boolean;
}

export const modelRegistry: Record<ImageModel, ModelInfo> = {
  'gemini': {
    id: 'gemini',
    label: 'Gemini 2.5 Flash',
    provider: 'google_gemini',
    requiresApiKey: true,
  },
  'seedream': {
    id: 'seedream',
    label: 'Seedream 4.5 (ARK)',
    provider: 'byteplus',
    requiresApiKey: true,
  },
  'hidream': {
    id: 'hidream',
    label: 'HiDream V2.1',
    provider: 'huggingface_api',
    modelId: 'digiplay/HiDream-v2',
    requiresApiKey: true,
  },
  'flux-dev': {
    id: 'flux-dev',
    label: 'FLUX.1 [dev]',
    provider: 'huggingface_api',
    modelId: 'black-forest-labs/FLUX.1-dev',
    requiresApiKey: true,
  },
  'flux-schnell': {
    id: 'flux-schnell',
    label: 'FLUX.1 [schnell]',
    provider: 'huggingface_api',
    modelId: 'black-forest-labs/FLUX.1-schnell',
    requiresApiKey: true,
  },
  'sdxl': {
    id: 'sdxl',
    label: 'SDXL Turbo',
    provider: 'huggingface_api',
    modelId: 'stabilityai/sdxl-turbo',
    requiresApiKey: true,
  },
  'openjourney': {
    id: 'openjourney',
    label: 'OpenJourney V4',
    provider: 'huggingface_api',
    modelId: 'prompthero/openjourney',
    requiresApiKey: true,
  },
};
