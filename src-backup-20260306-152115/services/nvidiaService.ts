import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const NvidiaApi = {
  chat: async (messages: any[], modelId: string = "meta/llama-4-maverick-17b-128e-instruct"): Promise<string> => {
    const apiKey = localStorage.getItem("nvidiaApiKey") || "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";
    if (!apiKey) throw new Error("NVIDIA API key not found. Please configure it in Settings.");

    const isNative = Capacitor.isNativePlatform();
    // Use standard OpenAI-compatible endpoint for NVIDIA NIMs
    const url = isNative 
      ? "https://integrate.api.nvidia.com/v1/chat/completions"
      : "/api/proxy/nvidia/chat";

    const payload = {
      model: modelId,
      messages: messages,
      temperature: 1.00,
      top_p: 1.00,
      max_tokens: 512,
      frequency_penalty: 0.00,
      presence_penalty: 0.00,
      stream: false
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    try {
      let data;
      if (isNative) {
        const response = await CapacitorHttp.post({ url, headers, data: payload });
        if (response.status !== 200) {
           throw new Error(`NVIDIA Chat API error (${response.status}): ${JSON.stringify(response.data)}`);
        }
        data = response.data;
      } else {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`NVIDIA Chat API error (${response.status}): ${errText}`);
        }
        data = await response.json();
      }

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error("Invalid response format from NVIDIA Chat API");
      }
    } catch (error: any) {
      console.error("NVIDIA Chat Error:", error);
      throw error;
    }
  },

  generate: async (prompt: string, presetBasePrompt: string, presetNegativePrompt: string, modelId: string = "stabilityai/stable-diffusion-3.5-large", base64Image?: string): Promise<string> => {
    const apiKey = localStorage.getItem("nvidiaApiKey");
    
    const parts = [];
    if (presetBasePrompt) parts.push(presetBasePrompt);
    if (prompt) parts.push(prompt);
    
    let finalPrompt = parts.join(", ");
    if (presetNegativePrompt) {
      finalPrompt += `. Avoid: ${presetNegativePrompt}`;
    }

    // Determine URL based on platform
    // For native, we hit the Nvidia API directly
    // For web, we use the proxy to avoid CORS
    const isNative = Capacitor.isNativePlatform();
    const url = isNative 
      ? `https://ai.api.nvidia.com/v1/genai/${modelId}`
      : "/api/generate/nvidia";

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      // Payload structure differs slightly between direct API and our proxy
      // Proxy expects { prompt, model }
      // Direct API expects specific payload structure for SD3.5
      let payload: any;
      
      if (isNative) {
        // Direct NVIDIA API Payload for SD3.5
        payload = {
          prompt: finalPrompt,
          negative_prompt: presetNegativePrompt || "",
          cfg_scale: 5,
          aspect_ratio: "1:1",
          seed: 0,
          steps: 50
        };
      } else {
        // Proxy Payload
        payload = {
          prompt: finalPrompt,
          model: modelId,
          negative_prompt: presetNegativePrompt || ""
        };
      }

      let data;

      if (isNative) {
        const response = await CapacitorHttp.post({
          url,
          headers,
          data: payload
        });

        if (response.status !== 200) {
           // CapacitorHttp error response body is in response.data
           const errorMsg = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
           throw new Error(`NVIDIA API error (${response.status}): ${errorMsg}`);
        }
        data = response.data;
      } else {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`NVIDIA API error (${response.status}): ${errText}`);
        }
        data = await response.json();
      }
      
      if (data.artifacts && data.artifacts.length > 0 && data.artifacts[0].base64) {
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      } else if (data.data && data.data.length > 0 && data.data[0].b64_json) {
        return `data:image/png;base64,${data.data[0].b64_json}`;
      } else if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else {
        throw new Error("Invalid response format from NVIDIA API: Missing image data");
      }
    } catch (error: any) {
      console.error("NVIDIA Generation Error:", error);
      throw error;
    }
  }
};
