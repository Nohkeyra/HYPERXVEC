import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ProviderName = "seedream" | "nim" | "cloudflare" | "pollinations" | "aihorde" | "hf" | "gemini";

type Job<T> = { fn: () => Promise<T>; resolve: (v: T) => void; reject: (e: any) => void };
const generationQueue: Job<any>[] = [];
let processing = false;

function detectGPU() {
  return !!(process.env.NVIDIA_VISIBLE_DEVICES || process.env.CUDA_VISIBLE_DEVICES);
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (generationQueue.length > 0) {
    const job = generationQueue.shift();
    if (!job) continue;
    try {
      const out = await job.fn();
      job.resolve(out);
    } catch (e) {
      job.reject(e);
    }
  }
  processing = false;
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    generationQueue.push({ fn, resolve, reject });
    processQueue();
  });
}

function withDataUrlIfNeeded(base64OrDataUrl?: string) {
  if (!base64OrDataUrl) return undefined;
  if (base64OrDataUrl.startsWith("data:")) return base64OrDataUrl;
  if (base64OrDataUrl.startsWith('/9j/')) return `data:image/jpeg;base64,${base64OrDataUrl}`;
  if (base64OrDataUrl.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${base64OrDataUrl}`;
  if (base64OrDataUrl.startsWith('R0lGOD')) return `data:image/gif;base64,${base64OrDataUrl}`;
  if (base64OrDataUrl.startsWith('UklGR')) return `data:image/webp;base64,${base64OrDataUrl}`;
  return `data:image/png;base64,${base64OrDataUrl}`;
}

function toDataUrl(base64: string, mime = "image/png") {
  if (base64.startsWith("data:")) return base64;
  return `data:${mime};base64,${base64}`;
}

async function urlToDataUrl(url: string): Promise<string> {
  console.log(`Downloading image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image from ${url}`);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mime = response.headers.get('content-type') || 'image/png';
  return `data:${mime};base64,${base64}`;
}

function getPromptCategory(prompt: string) {
  const text = prompt.toLowerCase();
  if (/(logo|brandmark|wordmark|badge|emblem|vector|typography|lettering)/.test(text)) return "logo";
  if (/(anime|manga|waifu|cel shaded|illustration)/.test(text)) return "anime";
  if (/(photo|photoreal|realistic|cinematic portrait|dslr)/.test(text)) return "photo";
  if (/(sketch|concept|line art|wireframe)/.test(text)) return "sketch";
  return "general";
}

function selectPreferredProviders(args: { prompt: string; model?: string; prefer?: string; hasBaseImage?: boolean; hasArkHeader?: boolean; }) {
  const { model, prefer } = args;
  const requested = String(model || prefer || "").toLowerCase();

  // Strict Manual Selection
  if (requested.startsWith("seedream") || requested === "byteplus") {
    return ["seedream"];
  }
  if (requested === "cloudflare" || requested === "cloudflare-sdxl") {
    return ["cloudflare"];
  }
  if (requested === "pollinations") {
    return ["pollinations"];
  }
  if (requested === "aihorde" || requested === "ai-horde" || requested === "horde") {
    return ["aihorde"];
  }
  if (requested === "hf" || requested === "huggingface" || requested === "flux-hf") {
    return ["hf"];
  }
  if (requested === "nim" || requested === "nvidia-nim") {
    return ["nim"];
  }
  if (requested.includes("gemini")) {
    return ["gemini"];
  }

  // Default fallback if nothing matches (should not happen in manual mode, but safe to have)
  return ["seedream"];
}

async function generateWithSeedream(prompt: string, model: string | undefined, base64Image: string | undefined, auth: string) {
  const payload: any = {
    model: model && model.toLowerCase().startsWith("seedream") ? model : "seedream-4-5-251128",
    prompt,
    sequential_image_generation: "disabled",
    response_format: "url",
    size: "2K",
    stream: false,
    watermark: true
  };
  const image = withDataUrlIfNeeded(base64Image);
  if (image) payload.image = image;

  const r = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const t = await r.text();
    throw Object.assign(new Error(`Seedream failed: ${t}`), { status: r.status });
  }
  const data: any = await r.json();
  console.log("Seedream raw response:", JSON.stringify(data, null, 2));

  let imageUrl: string | undefined;
  if (data.data && Array.isArray(data.data) && data.data[0]) {
    imageUrl = data.data[0].url || data.data[0].image_url;
  }

  if (imageUrl) {
    const image = await urlToDataUrl(imageUrl);
    return { provider: "seedream", image };
  }

  throw new Error("Seedream did not return a valid image URL");
}

async function generateWithNim(prompt: string) {
  if (!process.env.NGC_API_KEY) throw new Error("NGC_API_KEY missing");
  const r = await fetch("https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/stabilityai/sdxl-turbo", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NGC_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });
  if (!r.ok) {
    const t = await r.text();
    throw Object.assign(new Error(`NIM failed: ${t}`), { status: r.status });
  }
  const contentType = r.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data: any = await r.json();
    console.log("NIM raw response:", JSON.stringify(data, null, 2));
    if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
        return { provider: "nim", image: toDataUrl(data.artifacts[0].base64) };
    }
    if (data.b64_json) {
        return { provider: "nim", image: toDataUrl(data.b64_json) };
    }
    if (data.data && data.data[0] && data.data[0].b64_json) {
        return { provider: "nim", image: toDataUrl(data.data[0].b64_json) };
    }
    throw new Error("NIM JSON response did not contain a recognized image field");
  }
  const buf = Buffer.from(await r.arrayBuffer());
  return { provider: "nim", image: toDataUrl(buf.toString("base64")) };
}

async function generateWithCloudflare(prompt: string, base64Image?: string) {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error("Cloudflare credentials missing");
  }
  const model = process.env.CLOUDFLARE_AI_MODEL || "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  const payload: any = { prompt };
  if (base64Image) payload.image_b64 = withDataUrlIfNeeded(base64Image)?.split(",")[1] || base64Image;
  const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const t = await r.text();
    throw Object.assign(new Error(`Cloudflare failed: ${t}`), { status: r.status });
  }
  const contentType = r.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data: any = await r.json();
    console.log("Cloudflare raw response:", JSON.stringify(data, null, 2));
    if (data?.result?.image) return { provider: "cloudflare", image: toDataUrl(data.result.image) };
    throw new Error("Cloudflare JSON response did not contain image");
  }
  const buf = Buffer.from(await r.arrayBuffer());
  return { provider: "cloudflare", image: toDataUrl(buf.toString("base64")) };
}

async function generateWithPollinations(prompt: string) {
  const baseUrl = process.env.POLLINATIONS_URL || 'https://image.pollinations.ai';
  const url = `${baseUrl}/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  const r = await fetch(url);
  if (!r.ok) {
    const t = await r.text();
    throw Object.assign(new Error(`Pollinations failed: ${t}`), { status: r.status });
  }
  const buf = Buffer.from(await r.arrayBuffer());
  return { provider: "pollinations", image: toDataUrl(buf.toString("base64")) };
}

async function generateWithAiHorde(prompt: string) {
  const hordeBase = process.env.AI_HORDE_API || "https://aihorde.net/api/v2";
  const submit = await fetch(`${hordeBase}/generate/async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      params: { width: 1024, height: 1024, steps: 25 },
      nsfw: false,
      censor_nsfw: true,
      trusted_workers: false,
      slow_workers: true
    })
  });
  if (!submit.ok) {
    const t = await submit.text();
    throw Object.assign(new Error(`AI Horde submit failed: ${t}`), { status: submit.status });
  }
  const submitData: any = await submit.json();
  console.log("AI Horde submit response:", JSON.stringify(submitData, null, 2));
  const id = submitData?.id;
  if (!id) throw new Error("AI Horde did not return a job id");

  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 4000));
    const status = await fetch(`${hordeBase}/generate/status/${id}`);
    if (!status.ok) continue;
    const data: any = await status.json();
    console.log("AI Horde status response:", JSON.stringify(data, null, 2));
    if (data?.done && Array.isArray(data?.generations) && data.generations.length > 0) {
      const img = data.generations[0]?.img;
      if (!img) break;
      return { provider: "aihorde", image: toDataUrl(img) };
    }
  }
  throw new Error("AI Horde timed out waiting for generation");
}

async function generateWithHf(prompt: string) {
  if (!process.env.HF_TOKEN) throw new Error("HF_TOKEN missing");
  const r = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  if (!r.ok) {
    const t = await r.text();
    throw Object.assign(new Error(`HF failed: ${t}`), { status: r.status });
  }
  const buf = Buffer.from(await r.arrayBuffer());
  return { provider: "hf", image: toDataUrl(buf.toString("base64")) };
}

async function generateWithGemini(prompt: string, model: string | undefined, base64Image?: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API key missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = model && model.includes("gemini") ? model : "gemini-2.5-flash-image";
  
  const parts: any[] = [];
  if (base64Image) {
    const match = base64Image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
    }
  }
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: parts,
    },
  });
  console.log("Gemini raw response:", JSON.stringify(response, null, 2));

  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return { 
          provider: "gemini", 
          image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` 
        };
      }
    }
  }
  throw new Error("Gemini did not return an image");
}

async function describeImageWithGemini(base64Image: string, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API key missing");

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash-exp"; 

  const parts = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image.split(',')[1]
      }
    },
    { text: "Describe the main subject of this image in a concise phrase for an AI art prompt." }
  ];

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "subject";
}

async function analyzeImageWithGemini(base64Image: string, mimeType: string, activeTab: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("Gemini API key missing");

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash-exp";

  let systemInstruction = `Analyze the artistic style of this image in extreme detail.`;
  
  if (activeTab === 'logo design') {
    systemInstruction += `
      Focus specifically on LOGO DESIGN elements:
      1. Shape psychology and geometry (minimalist, abstract, geometric)
      2. Negative space usage
      3. Brand personality (modern, luxury, tech, vintage)
      4. Color psychology (limit to 2-3 dominant colors)
      5. Scalability and versatility
      
      Ignore complex backgrounds or illustrative details irrelevant to logos.
    `;
  } else if (activeTab === 'core lettering') {
    systemInstruction += `
      Focus specifically on TYPOGRAPHY and LETTERING:
      1. Font style (serif, sans-serif, script, graffiti, gothic)
      2. Letterform characteristics (weight, kerning, flourishes)
      3. Text effects (3D, shadow, outline, gradient, chrome)
      4. Readability and flow
      
      Ignore character subjects unless they are part of the text integration.
    `;
  } else {
    systemInstruction += `
      Focus on VECTOR ILLUSTRATION style:
      1. Line work (thickness, variability, clean vs sketch)
      2. Color palette (flat, shading style, gradients)
      3. Composition and dimensionality (flat, 2.5D, isometric)
      4. Texture and finish (clean, grunge, noise, grain)
    `;
  }

  systemInstruction += `
    Return a JSON object with this exact structure:
    {
      "basePrompt": "A detailed prompt fragment describing this style that can be appended to other prompts. Do NOT describe the subject, ONLY the style.",
      "negativePrompt": "What to avoid to maintain this style (e.g. 'photo-realistic' if it's a vector)",
      "aspectRatio": "1:1"
    }
  `;

  const parts = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image.split(',')[1]
      }
    },
    { text: systemInstruction }
  ];

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No analysis generated");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("Failed to parse analysis JSON", e);
    return {
      basePrompt: text.substring(0, 200),
      negativePrompt: "",
      aspectRatio: "1:1"
    };
  }
}

import crypto from "crypto";

const CACHE_DIR = path.join(__dirname, "cache");

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (e) {
    console.error("Failed to create cache directory:", e);
  }
}

function getCacheKey(prompt: string, model: string, settings: any) {
  const data = JSON.stringify({ prompt, model, settings });
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function checkCache(key: string) {
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const cached = JSON.parse(data);
    // Check expiration (24 hours)
    if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
      await fs.unlink(filePath);
      return null;
    }
    return cached;
  } catch (e) {
    return null;
  }
}

async function saveCache(key: string, data: any) {
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch (e) {
    console.error("Failed to save cache:", e);
  }
}

async function startServer() {
  await ensureCacheDir();
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/cache-status", async (req, res) => {
    try {
      const files = await fs.readdir(CACHE_DIR);
      const jsonFiles = files.filter(f => f.endsWith(".json"));
      res.json({ count: jsonFiles.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/describe-image", async (req, res) => {
    try {
      const { base64Image, mimeType } = req.body;
      if (!base64Image || !mimeType) return res.status(400).json({ error: "Image and mimeType required" });
      const description = await describeImageWithGemini(base64Image, mimeType);
      res.json({ description });
    } catch (error: any) {
      console.error("Describe Image Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { base64Image, mimeType, activeTab } = req.body;
      if (!base64Image || !mimeType) return res.status(400).json({ error: "Image and mimeType required" });
      const analysis = await analyzeImageWithGemini(base64Image, mimeType, activeTab);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analyze Image Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    const { prompt, model, base64Image, prefer, useCache } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    // Check Cache
    if (useCache) {
      const cacheKey = getCacheKey(prompt, model || "default", { base64Image: !!base64Image });
      const cached = await checkCache(cacheKey);
      if (cached) {
        return res.json({ ...cached, cached: true });
      }
    }

    const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
    const bodyArkKey = req.body?.arkApiKey ? `Bearer ${req.body.arkApiKey}` : "";
    let seedreamAuth = authHeader.startsWith("Bearer ") ? authHeader : bodyArkKey;
    
    // Fallback to server-side key if not provided by client
    if (!seedreamAuth && process.env.ARK_API_KEY) {
      seedreamAuth = `Bearer ${process.env.ARK_API_KEY}`;
    }

    const hasBaseImage = !!base64Image;

    const order = selectPreferredProviders({
      prompt,
      model,
      prefer,
      hasBaseImage,
      hasArkHeader: !!seedreamAuth
    });

    try {
      const result = await enqueue(async () => {
        const failures: string[] = [];
        for (const provider of order) {
          try {
            if (provider === "seedream") {
              if (!seedreamAuth) throw new Error("Missing Seedream authorization");
              return await generateWithSeedream(prompt, model, base64Image, seedreamAuth);
            }
            if (provider === "nim") return await generateWithNim(prompt);
            if (provider === "cloudflare") return await generateWithCloudflare(prompt, base64Image);
            if (provider === "pollinations") return await generateWithPollinations(prompt);
            if (provider === "aihorde") return await generateWithAiHorde(prompt);
            if (provider === "hf") return await generateWithHf(prompt);
            if (provider === "gemini") return await generateWithGemini(prompt, model, base64Image);
          } catch (e: any) {
            failures.push(`${provider}: ${e?.message || String(e)}`);
          }
        }
        throw Object.assign(new Error(`All providers failed. ${failures.join(" | ")}`), { status: 502 });
      });

      // Save to Cache
      if (useCache) {
        const cacheKey = getCacheKey(prompt, model || "default", { base64Image: !!base64Image });
        await saveCache(cacheKey, { ...result, prompt, model });
      }

      res.json({
        success: true,
        provider: result.provider,
        model: model || "default",
        image: result.image,
        route: order
      });
    } catch (e: any) {
      res.status(e?.status || 500).json({ error: e?.message || "Generation failed", route: order });
    }
  });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024,
      files: 5
    }
  });

  app.post("/api/analyze-zip", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded." });
      const zip = new AdmZip(req.file.buffer);
      const zipEntries = zip.getEntries();
      let extractedContent = "";
      let fileCount = 0;

      zipEntries.forEach((entry) => {
        if (!entry.isDirectory && !entry.entryName.startsWith("__MACOSX") && !entry.name.startsWith(".") && entry.name.match(/\.(txt|md|js|ts|tsx|jsx|json|py|c|cpp|h|css|html|sh|yml|yaml|xml|csv)$/i)) {
          extractedContent += `
--- File: ${entry.entryName} ---
`;
          extractedContent += entry.getData().toString("utf8");
          fileCount++;
        }
      });

      if (fileCount === 0) return res.status(400).json({ error: "No readable text files found in the ZIP." });
      res.json({ message: "ZIP processed successfully", fileCount, content: extractedContent });
    } catch (error: any) {
      console.error("[ZIP Analysis] Error:", error.message);
      res.status(500).json({ error: "Error processing ZIP file." });
    }
  });

  app.post("/api/generate/vertex", async (req, res) => {
    try {
      const { projectId, region, endpointId, instances, parameters } = req.body;
      if (!projectId || !region || !endpointId) {
        return res.status(400).json({ error: "Missing Vertex AI configuration parameters." });
      }
      const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/endpoints/${endpointId}:predict`;
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "Missing Authorization header for Vertex AI" });
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": authHeader },
        body: JSON.stringify({ instances, parameters })
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).send(errorText);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/proxy/byteplus", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });
      const upstream = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": authHeader },
        body: JSON.stringify(req.body)
      });
      const text = await upstream.text();
      res.status(upstream.status).type(upstream.headers.get("content-type") || "application/json").send(text);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });

  app.use(vite.middlewares);

  app.use("/api", (req, res) => {
    res.status(404).json({
      error: `API route not found: ${req.method} ${req.originalUrl}`
    });
  });

  app.get("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      const template = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
