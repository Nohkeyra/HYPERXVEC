import { validateModelCall } from "./modelValidator";
import { BytePlusApi } from './bytePlusService';
import { FluxPipeline } from './FluxPipeline';
import { safeLocalStorage } from '../utils/storageUtils';
import { ImageModel } from './modelRegistry';
import { apiUrl } from '../utils/apiBase';

const OFFLINE_IMAGE_QUEUE_KEY = "offlineImageQueue_v1";

type OfflineQueueItem = {
  id: string;
  prompt: string;
  model: ImageModel;
  presetBasePrompt: string;
  presetNegativePrompt: string;
  base64Image?: string;
  createdAt: number;
};

function readQueue(): OfflineQueueItem[] {
  try {
    const raw = safeLocalStorage.getItem(OFFLINE_IMAGE_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: OfflineQueueItem[]) {
  safeLocalStorage.setItem(OFFLINE_IMAGE_QUEUE_KEY, JSON.stringify(items));
}

function enqueueOffline(item: Omit<OfflineQueueItem, "id" | "createdAt">) {
  const q = readQueue();
  q.push({ id: Math.random().toString(36).slice(2), createdAt: Date.now(), ...item });
  writeQueue(q);
}

export async function processOfflineImageQueue(
  onResult?: (image: string, prompt: string, model: ImageModel) => void,
  onError?: (err: Error, prompt: string, model: ImageModel) => void
) {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  const q = readQueue();
  if (!q.length) return;

  const remaining: OfflineQueueItem[] = [];
  for (const item of q) {
    try {
      const result = await generateImageImmediate(item.prompt, item.model, item.presetBasePrompt, item.presetNegativePrompt, item.base64Image);
      onResult?.(result.image, item.prompt, item.model);
    } catch (e: any) {
      remaining.push(item);
      onError?.(e instanceof Error ? e : new Error(String(e)), item.prompt, item.model);
    }
  }

  writeQueue(remaining);
}

async function generateViaRouter(prompt: string, model: string, presetBasePrompt: string, presetNegativePrompt: string, base64Image?: string, useCache: boolean = true): Promise<{ image: string, cached?: boolean }> {
  const arkApiKey = safeLocalStorage.getItem("arkApiKey");
  const fullPrompt = [presetBasePrompt, prompt, presetNegativePrompt ? `Avoid: ${presetNegativePrompt}` : ""].filter(Boolean).join(", ");
  const requestModel = model;
  const explicitSeedream = model.toLowerCase().startsWith('seedream');

  const response = await fetch(apiUrl('/api/generate-image'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(arkApiKey ? { Authorization: `Bearer ${arkApiKey}` } : {})
    },
    body: JSON.stringify({
      prompt: fullPrompt,
      model: requestModel,
      prefer: explicitSeedream ? 'seedream' : undefined,
      base64Image,
      useCache
    })
  });

  const rawText = await response.text();
  let data: any = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { rawText };
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `Router generation failed (${response.status}): ${
        typeof data?.rawText === 'string' ? data.rawText.slice(0, 300) : rawText.slice(0, 300)
      }`
    );
  }

  if (typeof data?.image === 'string' && data.image.length > 0) {
    return { image: data.image, cached: data.cached };
  }

  throw new Error(
    `Router did not return an image. Status: ${response.status}. Response: ${
      typeof data?.rawText === 'string' ? data.rawText.slice(0, 300) : JSON.stringify(data)
    }`
  );
}

async function generateImageImmediate(prompt: string, model: ImageModel = 'gemini', presetBasePrompt: string, presetNegativePrompt: string, base64Image?: string, useCache: boolean = true): Promise<{ image: string, cached?: boolean }> {
  const arkApiKey = safeLocalStorage.getItem("arkApiKey");
  const hfApiKey = safeLocalStorage.getItem("hfApiKey");

  const modelInfo = validateModelCall(model, { arkApiKey, hfApiKey });

  if (modelInfo.provider === 'router') {
    // Pass the specific modelId if available, otherwise the generic ID
    const targetModel = modelInfo.modelId || model;
    return generateViaRouter(prompt, targetModel, presetBasePrompt, presetNegativePrompt, base64Image, useCache);
  }

  if (modelInfo.provider === 'byteplus') {
    const img = await BytePlusApi.generate(prompt, presetBasePrompt, presetNegativePrompt, modelInfo.modelId, base64Image);
    return { image: img };
  }

  if (modelInfo.provider === 'huggingface') {
    if (!hfApiKey) throw new Error("Hugging Face API key is missing");
    const pipeline = new FluxPipeline(hfApiKey, modelInfo.modelId);
    let fullPrompt = prompt.length < 20 ? `Stylized typography of the word '${prompt}'` : prompt;
    if (presetBasePrompt) {
      const processedBasePrompt = presetBasePrompt.replace(/\[WORD\]/g, prompt).replace(/\[Subject\]/g, prompt);
      if (presetBasePrompt.includes('[WORD]') || presetBasePrompt.includes('[Subject]')) {
        fullPrompt = processedBasePrompt;
      } else if (!fullPrompt.toLowerCase().includes(presetBasePrompt.toLowerCase())) {
        fullPrompt = `${presetBasePrompt}, ${fullPrompt}`;
      }
    }
    fullPrompt = fullPrompt.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim();
    const blob = await pipeline.generate(fullPrompt, {
      negative_prompt: presetNegativePrompt,
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
      guidance_scale: 0.0,
      seed: Math.floor(Math.random() * 1000000)
    });
    if (!(blob instanceof Blob)) throw new Error("Flux generation did not return a valid image blob");
    const img = await blobToBase64(blob);
    return { image: img };
  }

  throw new Error(`Unsupported model provider: ${modelInfo.provider}`);
}

export async function generateImage(prompt: string, model: ImageModel = 'gemini', presetBasePrompt: string, presetNegativePrompt: string, base64Image?: string, useCache: boolean = true): Promise<{ image: string, cached?: boolean }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOffline({ prompt, model, presetBasePrompt, presetNegativePrompt, base64Image });
    throw new Error("Offline. Added to queue. It will run when you are online.");
  }
  return generateImageImmediate(prompt, model, presetBasePrompt, presetNegativePrompt, base64Image, useCache);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
