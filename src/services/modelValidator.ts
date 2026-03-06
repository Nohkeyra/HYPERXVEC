import { modelRegistry, ModelInfo, ImageModel } from './modelRegistry';

class ModelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ModelValidationError';
  }
}

export function validateModelCall(modelId: string, keys: { arkApiKey?: string | null, hfApiKey?: string | null }): ModelInfo {
  const modelInfo = modelRegistry[modelId as ImageModel];

  if (!modelInfo) {
    throw new ModelValidationError(`Model '${modelId}' is not registered.`);
  }

  if (modelInfo.provider === 'router') {
    return modelInfo;
  }

  if (modelInfo.requiresApiKey) {
    if (modelInfo.provider === 'byteplus' && !keys.arkApiKey) {
      throw new ModelValidationError(`Model '${modelId}' requires a BytePlus API key. Please add it in Settings.`);
    }
    if (modelInfo.provider === 'huggingface' && !keys.hfApiKey) {
      throw new ModelValidationError(`Model '${modelId}' requires a Hugging Face API key. Please add it in Settings.`);
    }
  }

  return modelInfo;
}
