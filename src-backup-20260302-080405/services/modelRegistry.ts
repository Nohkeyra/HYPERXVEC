export type ImageModel = 'gemini' | 'seedream-4.5' | 'seedream-4.0' | 'nvidia-sd35-large';

export interface ModelInfo {
  id: ImageModel;
  label: string;
  provider: 'google_gemini' | 'byteplus' | 'nvidia';
  modelId?: string; // For BytePlus or NVIDIA models
  requiresApiKey: boolean;
}

export const modelRegistry: Record<ImageModel, ModelInfo> = {
  'gemini': {
    id: 'gemini',
    label: 'Gemini 2.5 Flash',
    provider: 'google_gemini',
    requiresApiKey: true,
  },
  'seedream-4.5': {
    id: 'seedream-4.5',
    label: 'Seedream 4.5',
    provider: 'byteplus',
    modelId: 'seedream-4-5-251128',
    requiresApiKey: true,
  },
  'seedream-4.0': {
    id: 'seedream-4.0',
    label: 'Seedream 4.0',
    provider: 'byteplus',
    modelId: 'seedream-4-0-241011', 
    requiresApiKey: true,
  },
  'nvidia-sd35-large': {
    id: 'nvidia-sd35-large',
    label: 'NVIDIA SD 3.5 Large',
    provider: 'nvidia',
    modelId: 'stabilityai/stable-diffusion-3.5-large',
    requiresApiKey: true,
  },
};
