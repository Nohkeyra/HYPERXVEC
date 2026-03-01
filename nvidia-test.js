import axios from 'axios';

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

const headers = {
  "Authorization": "Bearer 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",
  "Content-Type": "application/json"
};

const payload = {
  "model": "meta/llama-4-maverick-17b-128e-instruct",
  "messages": [{"role":"user","content":"Tell me a short joke"}],
  "max_tokens": 100,
  "temperature": 0.7,
  "top_p": 0.9,
  "stream": false
};

console.log("🚀 Sending request to NVIDIA API...");

try {
  const response = await axios.post(invokeUrl, payload, { headers });
  console.log("\n✅ SUCCESS! Response received:\n");
  console.log(JSON.stringify(response.data, null, 2));
} catch (error) {
  console.error("\n❌ ERROR:\n");
  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
  } else if (error.request) {
    console.error("No response received. Check your internet connection.");
  } else {
    console.error("Error:", error.message);
  }
}
