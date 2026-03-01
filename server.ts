import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Check if NVIDIA is configured on server
  app.get("/api/config/nvidia", (req, res) => {
    res.json({ configured: !!process.env.NVIDIA_API_KEY });
  });

  // NVIDIA SD 3.5 Generation Endpoint
  app.post("/api/generate/nvidia", async (req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 120s timeout

    try {
      const { prompt, model = "stabilityai/stable-diffusion-3.5-large" } = req.body;
      let apiKey = process.env.NVIDIA_API_KEY;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
         const clientKey = authHeader.split(" ")[1];
         if (clientKey && clientKey.trim().length > 0 && clientKey !== "null" && clientKey !== "undefined") {
             apiKey = clientKey;
         }
      }

      if (!apiKey) {
        return res.status(412).json({ error: "NVIDIA_API_KEY_NOT_SET" });
      }

      console.log(`[NVIDIA] Starting generation for: "${prompt.substring(0, 30)}..."`);

      const response = await fetch("https://integrate.api.nvidia.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          aspect_ratio: "1:1",
          num_images: 1,
          steps: 30,
          seed: Math.floor(Math.random() * 1000000)
        }),
        signal: controller.signal as any
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[NVIDIA] API Error (${response.status}):`, errorData);
        return res.status(response.status).json({ error: "NVIDIA API Error", details: errorData });
      }

      const data = await response.json();
      console.log("[NVIDIA] Success: Image data received.");
      res.json(data);

    } catch (error: any) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        return res.status(504).json({ error: "NVIDIA generation timed out." });
      }
      console.error("[NVIDIA] Critical Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
