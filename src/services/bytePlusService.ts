import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const BytePlusApi = {
  generate: async (prompt: string, presetBasePrompt: string, presetNegativePrompt: string, modelId: string = "seedream-4-5-251128", base64Image?: string): Promise<string> => {
    const apiKey = localStorage.getItem("arkApiKey");
    if (!apiKey) throw new Error("BytePlus API key not found. Please configure it in Settings (Node_02).");

    const finalPrompt = `${presetBasePrompt}, ${prompt}. Avoid: ${presetNegativePrompt}`;

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
      // Ensure base64 format is correct: data:image/<format>;base64,<data>
      // If it's just raw base64, we should wrap it.
      const formattedImage = base64Image.startsWith('data:') 
        ? base64Image 
        : `data:image/png;base64,${base64Image}`;
      payload.image = formattedImage;
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    try {
      let data;
      
      if (Capacitor.isNativePlatform()) {
        // Use CapacitorHttp to bypass CORS on mobile
        const response = await CapacitorHttp.post({
          url,
          headers,
          data: payload
        });

        if (response.status !== 200) {
          throw new Error(`BytePlus API error (${response.status}): ${JSON.stringify(response.data)}`);
        }
        data = response.data;
      } else {
        // Use standard fetch for web preview
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`BytePlus API error (${response.status}): ${err}`);
        }
        data = await response.json();
      }
      
      if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else if (data.error) {
        throw new Error(`BytePlus API error: ${data.error.message || JSON.stringify(data.error)}`);
      } else {
        throw new Error("Invalid response format from BytePlus API");
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
