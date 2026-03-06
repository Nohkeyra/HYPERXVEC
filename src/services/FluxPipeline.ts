import { HfInference } from "@huggingface/inference";

export interface FluxPipelineOptions {
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
}

export class FluxPipeline {
  private hf: HfInference;
  private modelId: string;

  constructor(apiKey: string, modelId: string = "black-forest-labs/FLUX.1-schnell") {
    this.hf = new HfInference(apiKey);
    this.modelId = modelId;
  }

  /**
   * Creates a new instance of FluxPipeline.
   * Mimics the python `from_pretrained` method.
   */
  static fromPretrained(modelId: string, apiKey: string): FluxPipeline {
    return new FluxPipeline(apiKey, modelId);
  }

  /**
   * Generates an image from a text prompt.
   * @param prompt The prompt to generate the image from.
   * @param options Configuration options for generation.
   * @returns A Promise that resolves to a Blob containing the generated image.
   */
  async generate(prompt: string, options?: FluxPipelineOptions): Promise<Blob> {
    try {
      const response = await this.hf.textToImage({
        model: this.modelId,
        inputs: prompt,
        parameters: {
          negative_prompt: options?.negative_prompt,
          num_inference_steps: options?.num_inference_steps,
          guidance_scale: options?.guidance_scale,
          width: options?.width,
          height: options?.height,
          // Note: seed is not always supported by all inference endpoints directly in parameters, 
          // but we pass it just in case the specific endpoint supports it.
          // @ts-ignore
          seed: options?.seed, 
        },
      });
      
      if (!((response as any) instanceof Blob)) {
        console.error("FluxPipeline response is not a Blob:", response);
        throw new Error("FluxPipeline did not return a valid Blob");
      }
      
      return response as unknown as Blob;
    } catch (error) {
      console.error("FluxPipeline generation error:", error);
      throw error;
    }
  }
}
