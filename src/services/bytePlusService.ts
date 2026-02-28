export const BytePlusApi = {
  generate: async (prompt: string, presetBasePrompt: string, presetNegativePrompt: string): Promise<string> => {
    const apiKey = localStorage.getItem("arkApiKey");
    if (!apiKey) throw new Error("BytePlus API key not found");

    const finalPrompt = `${presetBasePrompt}, ${prompt}. Avoid: ${presetNegativePrompt}`;

    try {
      const response = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "seedream-4-5-251128",
          prompt: finalPrompt,
          sequential_image_generation: "disabled",
          response_format: "url",
          size: "2K",
          stream: false,
          watermark: true
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`BytePlus API error: ${err}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else {
        throw new Error("Invalid response format from BytePlus API");
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error("Network error (CORS). The BytePlus API blocks direct web browser requests. This is expected in the web preview, but it WILL work when built as an Android APK.");
      }
      throw error;
    }
  }
};
