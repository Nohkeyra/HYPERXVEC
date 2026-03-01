
const API_BASE = import.meta.env.VITE_API_URL;

export async function generateImage(prompt: string) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return `data:image/png;base64,${data.data[0].b64_json}`;
}
