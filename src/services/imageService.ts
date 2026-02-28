import { compressImage } from "./imageUtils";
import { validateModelCall } from "./modelValidator";
import { BytePlusApi } from './bytePlusService';

import { ImageModel } from './modelRegistry';

export async function generateImage(prompt: string, model: ImageModel = 'gemini', presetBasePrompt: string, presetNegativePrompt: string): Promise<string> {
  const hfApiKey = localStorage.getItem("hfApiKey");
  const arkApiKey = localStorage.getItem("arkApiKey");

  const modelInfo = validateModelCall(model, hfApiKey || undefined, arkApiKey || undefined);

  if (modelInfo.provider === 'huggingface_api') {
    try {
      return await generateWithHF(prompt, modelInfo.modelId);
    } catch (error: any) {
      console.warn(`${modelInfo.modelId} generation failed:`, error.message);
      throw error;
    }
  }

  if (modelInfo.provider === 'byteplus') {
    try {
      return await BytePlusApi.generate(prompt, presetBasePrompt, presetNegativePrompt);
    } catch (error: any) {
      console.warn(`BytePlus (Seedream) generation failed:`, error.message);
      throw error;
    }
  }

  if (modelInfo.provider === 'google_gemini') {
    throw new Error("USE_GEMINI_FALLBACK");
  }

  throw new Error(`Unsupported model provider: ${modelInfo.provider}`);
}



async function generateWithHF(prompt: string, modelId: string): Promise<string> {
  const hfApiKey = localStorage.getItem("hfApiKey");
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers: Record<string, string> = { 
        "Content-Type": "application/json"
      };
      
      if (hfApiKey) {
        headers["Authorization"] = `Bearer ${hfApiKey}`;
      }

      const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle Model Loading (503)
        if (response.status === 503 && errorText.includes("loading")) {
          if (attempt < MAX_RETRIES) {
            console.warn(`Model ${modelId} is loading. Retrying in ${RETRY_DELAY/1000}s... (Attempt ${attempt}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            continue;
          }
          throw new Error(`Model ${modelId} is still loading after multiple attempts. Please try again later.`);
        }

        // Handle Auth Errors
        if (response.status === 401) {
          throw new Error(`Invalid or missing Hugging Face API Key. Please check your settings.`);
        }

        if (response.status === 403) {
          throw new Error(`Access denied for model ${modelId}. You may need to accept the license agreement on Hugging Face or upgrade your plan.`);
        }

        throw new Error(`HF API (${modelId}) failed with status: ${response.status}. ${errorText}`);
      }

      const blob = await response.blob();
      const dataUrl = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      return compressImage(dataUrl, 0.7);
    } catch (error: any) {
      // If it's the last attempt or a non-retriable error, throw it
      if (attempt === MAX_RETRIES || (error.message && !error.message.includes("loading"))) {
        console.error(`HF API Error (${modelId}):`, error);
        throw error;
      }
    }
  }
  
  throw new Error("Unknown error in HF generation");
}

