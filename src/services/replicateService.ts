import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface GenerationOptions {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_outputs?: number;
  scheduler?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export async function generateImageWithReplicate({
  prompt,
  negative_prompt = "",
  width = 1024,
  height = 1024,
  num_outputs = 1,
  scheduler = "DPMSolverMultistep",
  num_inference_steps = 30,
  guidance_scale = 7.5
}: GenerationOptions): Promise<string[]> {
  
  console.log("🎨 Generating image with Replicate...");
  
  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion-3.5-large",
      {
        input: {
          prompt,
          negative_prompt,
          width,
          height,
          num_outputs,
          scheduler,
          num_inference_steps,
          guidance_scale
        }
      }
    );
    
    console.log("✅ Image generated successfully!");
    return output; // Returns array of image URLs
    
  } catch (error) {
    console.error("❌ Error generating image:", error);
    throw error;
  }
}

// Helper to download and save images (for testing)
export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const fs = require('fs');
  fs.writeFileSync(filename, Buffer.from(buffer));
  console.log(`💾 Image saved as ${filename}`);
}
