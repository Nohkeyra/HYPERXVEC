
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export class NvidiaApi {
  private static readonly BASE_URL = 'https://ai.api.nvidia.com/v1/genai';

  static async generate(
    prompt: string,
    presetBasePrompt: string,
    presetNegativePrompt: string,
    modelId: string = 'stabilityai/sd3-5-large',
    base64Image?: string
  ): Promise<string> {
    const fullPrompt = `${presetBasePrompt}, ${prompt}`;

    // Try server-side generation first (using server-side API key)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // Increased to 120s timeout

      const response = await fetch('/api/generate/nvidia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: modelId
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        // Handle artifacts format (NIM style)
        if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
          return `data:image/png;base64,${data.artifacts[0].base64}`;
        }
        // Handle OpenAI-compatible format from integrate.api.nvidia.com
        if (data.data && data.data[0] && data.data[0].b64_json) {
          return `data:image/png;base64,${data.data[0].b64_json}`;
        }
        if (data.image) {
          return `data:image/png;base64,${data.image}`;
        }
      } else if (response.status === 412) {
        // Silent fallback: NVIDIA key not set on server, use client-side key
        console.info("NVIDIA server key not set, using client-side fallback.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("Server-side NVIDIA generation failed:", errorData.error || response.statusText);
      }
    } catch (e: any) {
      console.warn("Server-side NVIDIA generation failed or not configured, falling back to client-side", e.message);
    }

    const apiKey = localStorage.getItem('nvidiaApiKey');
    if (!apiKey) {
      throw new Error('NVIDIA API Key is missing. Please configure it in Settings or set NVIDIA_API_KEY on the server.');
    }
    
    // NVIDIA SD 3.5 Large endpoint
    const url = "https://integrate.api.nvidia.com/v1/images/generations";

    // Map common IDs to the full model names required by the integrate API
    const mappedModel = modelId === 'stabilityai/sd3-5-large' 
      ? 'stabilityai/stable-diffusion-3.5-large' 
      : modelId;

    const body: any = {
      model: mappedModel,
      prompt: fullPrompt,
      aspect_ratio: "1:1",
      mode: "base",
      seed: Math.floor(Math.random() * 1000000),
      steps: 30
    };

    // Note: negative_prompt is supported by some NIMs but not all. 
    // For SD 3.5 Large, we can try adding it if the API supports it, 
    // but the base NIM docs don't always show it.
    if (presetNegativePrompt) {
      body.negative_prompt = presetNegativePrompt;
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Use local proxy in web preview to bypass CORS
    const isWebPreview = !Capacitor.isNativePlatform();
    const requestUrl = isWebPreview ? "/api/proxy/nvidia" : url;

    try {
      let data;
      if (Capacitor.isNativePlatform()) {
        const response = await CapacitorHttp.post({
          url, // Use original url for APK
          headers,
          data: body
        });

        if (response.status !== 200) {
          console.error(`[NVIDIA] API Error Status: ${response.status}`, response.data);
          const errorMsg = response.data?.detail || response.data?.message || `NVIDIA API Error: ${response.status}`;
          throw new Error(errorMsg);
        }
        data = response.data;
      } else {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120000); // Increased to 120s timeout

        const response = await fetch(requestUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error || errorData.message || `NVIDIA API Error: ${response.statusText}`;
          throw new Error(errorMsg);
        }
        data = await response.json();
      }
      
      // NVIDIA NIMs typically return artifacts[0].base64
      if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      }
      
      if (data.image) {
        return `data:image/png;base64,${data.image}`;
      }

      throw new Error('Invalid response format from NVIDIA API');
    } catch (error: any) {
      console.error("NVIDIA Generation Error:", error);
      throw error;
    }
  }
}
