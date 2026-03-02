import { Capacitor, CapacitorHttp } from '@capacitor/core';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const VectorAssistantApi = {
  chat: async (messages: ChatMessage[], apiKey: string): Promise<string> => {
    if (!apiKey) throw new Error("BytePlus API key not found. Please configure it in Settings (Node_02).");

    const url = "https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions";
    const payload = {
      model: "gpt-oss-120b-250805",
      max_completion_tokens: 65535,
      messages: messages,
      reasoning_effort: "medium"
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    try {
      let data;
      
      if (Capacitor.isNativePlatform()) {
        const response = await CapacitorHttp.post({
          url,
          headers,
          data: payload
        });

        if (response.status !== 200) {
          throw new Error(`Vector Assistant API error (${response.status}): ${JSON.stringify(response.data)}`);
        }
        data = response.data;
      } else {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Vector Assistant API error (${response.status}): ${err}`);
        }
        data = await response.json();
      }
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error("Invalid response format from Vector Assistant API");
      }
    } catch (error: any) {
      console.error("Vector Assistant Chat Error:", error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error("Network error (CORS). The BytePlus API blocks direct web browser requests in the web preview. This is expected, but it WILL work when built as an Android APK.");
      }
      throw error;
    }
  }
};
