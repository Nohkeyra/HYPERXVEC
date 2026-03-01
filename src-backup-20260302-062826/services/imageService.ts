import { validateModelCall } from "./modelValidator";
import { BytePlusApi } from './bytePlusService';
import { NvidiaApi } from './nvidiaService';

import { ImageModel } from './modelRegistry';

export async function generateImage(
  prompt: string, 
  model: ImageModel = 'gemini', 
  presetBasePrompt: string, 
  presetNegativePrompt: string,
  base64Image?: string
): Promise<string> {
  const arkApiKey = localStorage.getItem("arkApiKey");
  const nvidiaApiKey = localStorage.getItem("nvidiaApiKey");

  const modelInfo = validateModelCall(model, { arkApiKey, nvidiaApiKey });

  if (modelInfo.provider === 'byteplus') {
    try {
      return await BytePlusApi.generate(prompt, presetBasePrompt, presetNegativePrompt, modelInfo.modelId, base64Image);
    } catch (error: any) {
      console.warn(`BytePlus (Seedream) generation failed:`, error.message);
      throw error;
    }
  }

  if (modelInfo.provider === 'nvidia') {
    try {
      return await NvidiaApi.generate(prompt, presetBasePrompt, presetNegativePrompt, modelInfo.modelId, base64Image);
    } catch (error: any) {
      console.warn(`NVIDIA generation failed:`, error.message);
      throw error;
    }
  }

  if (modelInfo.provider === 'google_gemini') {
    throw new Error("USE_GEMINI_FALLBACK");
  }

  throw new Error(`Unsupported model provider: ${modelInfo.provider}`);
}

