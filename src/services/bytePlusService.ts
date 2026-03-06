import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { safeLocalStorage } from '../utils/storageUtils';

export const BytePlusApi = {
  generate: async (prompt: string, presetBasePrompt: string, presetNegativePrompt: string, modelId: string = "seedream-4-5-251128", base64Image?: string): Promise<string> => {
    // Use provided key as fallback if not in local storage
    const apiKey = safeLocalStorage.getItem("arkApiKey");
    
    if (!apiKey) throw new Error("BytePlus API key not found. Please configure it in Settings (Node_02).");

    const parts = [];
    if (presetBasePrompt) parts.push(presetBasePrompt);
    if (prompt) parts.push(prompt);
    
    let finalPrompt = parts.join(", ");
    if (presetNegativePrompt) {
      finalPrompt += `. Avoid: ${presetNegativePrompt}`;
    }

    const url = "https://ark.ap-southeast.bytepluses.com/api/v3/images/generations";
    
    // Construct payload according to documentation
    const payload: any = {
      model: modelId,
      prompt: finalPrompt,
      sequential_image_generation: "disabled",
      response_format: "url",
      size: "2K",
      stream: false,
      watermark: true
    };

    // Add reference image if provided
    if (base64Image) {
      const getMimeType = (b64: string) => {
        if (b64.startsWith('/9j/')) return 'image/jpeg';
        if (b64.startsWith('iVBORw0KGgo')) return 'image/png';
        if (b64.startsWith('R0lGOD')) return 'image/gif';
        if (b64.startsWith('UklGR')) return 'image/webp';
        return 'image/png'; // fallback
      };

      // Ensure base64 format is correct: data:image/<format>;base64,<data>
      // If it's just raw base64, we should wrap it.
      const formattedImage = base64Image.startsWith('data:') 
        ? base64Image 
        : `data:${getMimeType(base64Image)};base64,${base64Image}`;
      payload.image = formattedImage;
      
      // For image-to-image, some APIs might require different parameters or endpoints.
      // Assuming standard OpenAI-compatible structure where 'image' is added to payload.
      // If the model supports image input, this should be correct.
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    console.log(`[BytePlus] Sending request to ${modelId}...`);

    // Use local proxy in web preview to bypass CORS
    const isWebPreview = !Capacitor.isNativePlatform();
    const requestUrl = isWebPreview ? "/api/proxy/byteplus" : url;

    try {
      let data;
      
      if (Capacitor.isNativePlatform()) {
        // Use CapacitorHttp to bypass CORS on mobile
        const response = await CapacitorHttp.post({
          url, // Use original url for APK
          headers,
          data: payload
        });

        if (response.status === 401) {
          throw new Error("Invalid BytePlus API Key. Please check your settings.");
        }
        if (response.status === 429) {
          throw new Error("BytePlus API Rate Limit Exceeded. Please try again later.");
        }
        if (response.status !== 200) {
          console.error(`[BytePlus] API Error Status: ${response.status}`, response.data);
          throw new Error(`BytePlus API error (${response.status}): ${JSON.stringify(response.data)}`);
        }
        data = response.data;
      } else {
        // Use standard fetch for web preview with local proxy
        const response = await fetch(requestUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (response.status === 401) {
          throw new Error("Invalid BytePlus API Key. Please check your settings.");
        }
        if (response.status === 429) {
          throw new Error("BytePlus API Rate Limit Exceeded. Please try again later.");
        }
        if (!response.ok) {
          const errText = await response.text();
          console.error(`[BytePlus] API Error Status: ${response.status}`, errText);
          throw new Error(`BytePlus API error (${response.status}): ${errText}`);
        }
        data = await response.json();
      }
      
      console.log(`[BytePlus] Response received:`, data);

      if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else if (data.error) {
        throw new Error(`BytePlus API error: ${data.error.message || JSON.stringify(data.error)}`);
      } else {
        throw new Error("Invalid response format from BytePlus API: Missing 'data[0].url'");
      }
    } catch (error: any) {
      console.error("BytePlus Generation Error:", error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error("Network error (CORS). The BytePlus API blocks direct web browser requests. This is expected in the web preview, but it WILL work when built as an Android APK.");
      }
      throw error;
    }
  }
};
