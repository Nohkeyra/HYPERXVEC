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
    const timeout = setTimeout(() => controller.abort(), 120000); // Increased to 120s timeout

    try {
      const { 
        prompt, 
        model = "stabilityai/sd3-5-large",
      } = req.body;
      const apiKey = process.env.NVIDIA_API_KEY;

      if (!apiKey) {
        return res.status(412).json({ error: "NVIDIA_API_KEY_NOT_SET" });
      }

      // Map common IDs to the full model names required by the integrate API
      const mappedModel = model === 'stabilityai/sd3-5-large' 
        ? 'stabilityai/stable-diffusion-3.5-large' 
        : model;

      // Use the 'integrate' endpoint which is standard for Stability AI models on NVIDIA
      const url = "https://integrate.api.nvidia.com/v1/images/generations";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: mappedModel,
          prompt,
          aspect_ratio: "1:1",
          mode: "base",
          seed: Math.floor(Math.random() * 1000000),
          steps: 30
        }),
        signal: controller.signal as any
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`NVIDIA API Error (${response.status}):`, errorText);
        return res.status(response.status).json({ error: `NVIDIA API Error: ${response.status}`, details: errorText });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      clearTimeout(timeout);
      if (error.name === 'AbortError' || controller.signal.aborted) {
        console.error("NVIDIA Generation Timeout (120s exceeded)");
        return res.status(504).json({ error: "NVIDIA generation timed out. The model is taking too long to respond. Please try again." });
      }
      console.error("NVIDIA Generation Error:", error);
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
