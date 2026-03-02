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
}

export async function generateImageWithReplicate({
  prompt,
  negative_prompt = "",
  width = 1024,
  height = 1024,
  num_outputs = 1
}: GenerationOptions): Promise<string[]> {
  
  console.log("🎨 Generating with Replicate...");
  
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
          num_inference_steps: 30
        }
      }
    );
    
    return output;
  } catch (error) {
    console.error("❌ Replicate error:", error);
    throw error;
  }
}
