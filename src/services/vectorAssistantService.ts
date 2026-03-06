import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { safeLocalStorage } from '../utils/storageUtils';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const VectorAssistantApi = {
  chat: async (messages: ChatMessage[], apiKey: string): Promise<string> => {
    const arkKey = safeLocalStorage.getItem("arkApiKey");
    
    // Default to BytePlus unless specifically requested or keys are missing
    const effectiveApiKey = apiKey || arkKey;
    
    if (!effectiveApiKey) throw new Error("BytePlus API key not found. Please configure it in Settings (Node_02).");

    const url = "https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions";
    const payload = {
      model: "gpt-oss-120b-250805",
      messages: messages
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${effectiveApiKey}`
    };

    try {
      let data;
      
      if (Capacitor.isNativePlatform()) {
        const response = await CapacitorHttp.post({
          url,
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
          throw new Error(`Vector Assistant API error (${response.status}): ${JSON.stringify(response.data)}`);
        }
        data = response.data;
      } else {
        const response = await fetch(url, {
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
