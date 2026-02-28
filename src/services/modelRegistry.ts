export type ImageModel = 'gemini' | 'seedream-5.0' | 'seedream-4.5' | 'seedream-4.0';

export interface ModelInfo {
  id: ImageModel;
  label: string;
  provider: 'google_gemini' | 'byteplus';
  modelId?: string; // For BytePlus models
  requiresApiKey: boolean;
}

export const modelRegistry: Record<ImageModel, ModelInfo> = {
  'gemini': {
    id: 'gemini',
    label: 'Gemini 2.5 Flash',
    provider: 'google_gemini',
    requiresApiKey: true,
  },
  'seedream-5.0': {
    id: 'seedream-5.0',
    label: 'Seedream 5.0 Lite',
    provider: 'byteplus',
    modelId: 'seedream-5-0-250128',
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
    modelId: 'seedream-4-0-250828',
    requiresApiKey: true,
  },
};
