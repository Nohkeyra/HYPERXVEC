import { modelRegistry, ModelInfo, ImageModel } from './modelRegistry';

class ModelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ModelValidationError';
  }
}

export function validateModelCall(modelId: string, byteplusApiKey?: string): ModelInfo {
  const modelInfo = modelRegistry[modelId as ImageModel];

  if (!modelInfo) {
    throw new ModelValidationError(`Model '${modelId}' is not registered.`);
  }

  if (modelInfo.requiresApiKey) {
    if (modelInfo.provider === 'byteplus' && !byteplusApiKey) {
      throw new ModelValidationError(
        `Model '${modelId}' requires a BytePlus API key. Please add it in Settings.`
      );
    }
  }

  return modelInfo;
}
