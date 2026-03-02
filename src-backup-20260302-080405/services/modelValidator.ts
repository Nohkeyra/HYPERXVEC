import { modelRegistry, ModelInfo, ImageModel } from './modelRegistry';

class ModelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ModelValidationError';
  }
}

export function validateModelCall(modelId: string, keys: { arkApiKey?: string | null, nvidiaApiKey?: string | null }): ModelInfo {
  const modelInfo = modelRegistry[modelId as ImageModel];

  if (!modelInfo) {
    throw new ModelValidationError(`Model '${modelId}' is not registered.`);
  }

  if (modelInfo.requiresApiKey) {
    if (modelInfo.provider === 'byteplus' && !keys.arkApiKey) {
      throw new ModelValidationError(
        `Model '${modelId}' requires a BytePlus API key. Please add it in Settings.`
      );
    }
    // NVIDIA key is optional on client side as it can be configured on server side
    /* if (modelInfo.provider === 'nvidia' && !keys.nvidiaApiKey) {
      throw new ModelValidationError(
        `Model '${modelId}' requires an NVIDIA API key. Please add it in Settings.`
      );
    } */
  }

  return modelInfo;
}
