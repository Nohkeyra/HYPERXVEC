
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-3.5-large",
        prompt,
        width: 1024,
        height: 1024,
        steps: 30,
        cfg_scale: 7
      })
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => {
  console.log("NVIDIA NIM proxy running on port 3001");
});
