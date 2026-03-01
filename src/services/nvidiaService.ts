import { Capacitor, CapacitorHttp } from '@capacitor/core';

export class NvidiaApi {
  // Updated endpoint - using the correct NVIDIA integrate API
  private static readonly BASE_URL = 'https://integrate.api.nvidia.com/v1/images/generations';

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
        // Handle OpenAI-compatible format (new endpoint)
        if (data.data && Array.isArray(data.data) && data.data[0]?.b64_json) {
          return `data:image/png;base64,${data.data[0].b64_json}`;
        }
        // Handle old format (for backwards compatibility)
        if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
          return `data:image/png;base64,${data.artifacts[0].base64}`;
        }
        if (data.image) {
          return `data:image/png;base64,${data.image}`;
        }
      } else if (response.status === 412) {
        // Silent fallback: NVIDIA key not set on server, use client-side key
        console.info("NVIDIA server key not set, using client-side fallback.");
      } else {
        // Better error handling for non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`NVIDIA server returned ${response.status} with non-JSON response: ${text.substring(0, 200)}`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn("Server-side NVIDIA generation failed:", errorData.error || response.statusText);
        }
      }
    } catch (e: any) {
      console.warn("Server-side NVIDIA generation failed or not configured, falling back to client-side", e.message);
    }

    const apiKey = localStorage.getItem('nvidiaApiKey');
    if (!apiKey) {
      throw new Error('NVIDIA API Key is missing. Please configure it in Settings or set NVIDIA_API_KEY on the server.');
    }
    
    // Correct NVIDIA endpoint URL
    const url = this.BASE_URL;

    const body: any = {
      model: modelId,
      prompt: fullPrompt,
      aspect_ratio: "1:1",
      num_images: 1,
      steps: 30,
      seed: Math.floor(Math.random() * 1000000)
    };

    // Add negative prompt if provided
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
          const errorMsg = response.data?.error?.message || response.data?.detail || response.data?.message || `NVIDIA API Error: ${response.status}`;
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
          // Better error handling - check response type first
          const contentType = response.headers.get('content-type');
          let errorMsg = `NVIDIA API Error: ${response.status}`;
          
          try {
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMsg = errorData.error?.message || errorData.error || errorData.message || errorMsg;
            } else {
              const text = await response.text();
              console.error(`NVIDIA returned HTML/plain text: ${text.substring(0, 300)}`);
              errorMsg = `NVIDIA API Error (${response.status}): Invalid endpoint or API key. Check console for details.`;
            }
          } catch (parseError) {
            console.error('Could not parse error response:', parseError);
          }
          
          throw new Error(errorMsg);
        }
        data = await response.json();
      }
      
      // Handle response - NVIDIA returns image in artifacts[0].base64
      if (data.artifacts && Array.isArray(data.artifacts) && data.artifacts[0]?.base64) {
        console.log('[NVIDIA] Successfully generated image');
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      }

      // Fallback formats
      if (data.image) {
        console.log('[NVIDIA] Successfully generated image (direct format)');
        return `data:image/png;base64,${data.image}`;
      }

      if (data.data && Array.isArray(data.data) && data.data[0]?.b64_json) {
        console.log('[NVIDIA] Successfully generated image (OpenAI format)');
        return `data:image/png;base64,${data.data[0].b64_json}`;
      }

      console.error('[NVIDIA] Unexpected response format:', Object.keys(data));
      throw new Error('Invalid response format from NVIDIA API. Expected artifacts[0].base64, data[0].b64_json, or image field.');
    } catch (error: any) {
      console.error("[NVIDIA] Generation Error:", error);
      throw error;
    }
  }
}
